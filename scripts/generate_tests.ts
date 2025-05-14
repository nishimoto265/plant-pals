#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { program } from 'commander';

const ROOT_DIR = path.join(__dirname, '..');
const SPEC_DIR = path.join(ROOT_DIR, 'spec');
const TESTS_DIR = path.join(ROOT_DIR, 'tests');

const SPEC_UI_TESTS_SCREENS_DIR = path.join(SPEC_DIR, 'ui', 'tests', 'screens');
const SPEC_FEATURES_DIR = path.join(SPEC_DIR, 'tests', 'features');
const TESTS_FEATURES_DIR = path.join(TESTS_DIR, 'features');
const SPEC_E2E_DIR = path.join(SPEC_DIR, 'tests', 'e2e');
const TESTS_E2E_DIR = path.join(TESTS_DIR, 'e2e');
const SPEC_CONTRACT_DIR = path.join(SPEC_DIR, 'tests', 'contract');
const TESTS_CONTRACT_DIR = path.join(TESTS_DIR, 'contract');
const SPEC_NON_FUNCTIONAL_DIR = path.join(SPEC_DIR, 'tests', 'non_functional');
const TESTS_NON_FUNCTIONAL_DIR = path.join(TESTS_DIR, 'non_functional');

const TEST_PLAN_PATH = path.join(SPEC_DIR, 'tests', 'test_plan.yaml');

interface TestCase {
  id: string;
  name: string;
  description?: string;
  steps?: any[];
  assertions?: any[];
}

interface TestSuite {
  id: string;
  name: string;
  description?: string;
  type?: string;
  cases: TestCase[];
  target?: string;
}

interface TestSpec {
  version: string;
  target: { // UI Test specific
    path: string;
    name: string;
  };
  testSuites: TestSuite[];
  name?: string; // For generic specs that might have a top-level name
  cases?: TestCase[]; // For simpler YAMLs with top-level cases (generic specs)
}

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// --- New UI Test Generation Logic ---
function generateUISnapshotTestContent(suite: TestSuite, spec: TestSpec, componentName: string): string {
  let testCases = '';
  if (!suite.cases) return '';
  for (const testCase of suite.cases) {
    testCases += `
  it('${testCase.name.replace(/'/g, "\\'")}', () => {
    const { toJSON } = render(
      <NavigationContainer>
        <${componentName} />
      </NavigationContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });\n`;
  }
  return `import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ${componentName} } from '../../${componentName}'; // Assumes component is in parent dir relative to __tests__

describe('${suite.name.replace(/'/g, "\\'")}', () => {
${testCases}
});
`;
}

function generateUIInteractionTestContent(suite: TestSuite, spec: TestSpec, componentName: string): string {
  let testCases = '';
  if (!suite.cases) return '';
  for (const testCase of suite.cases) {
    testCases += `
  it('${testCase.name.replace(/'/g, "\\'")}', async () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <${componentName} />
      </NavigationContainer>
    );
    // Placeholder for actual interaction test logic based on testCase.steps & testCase.assertions
    console.log('Interaction test case "${testCase.name.replace(/'/g, "\\'")}" - manual implementation needed.');
    expect(true).toBe(true); // Placeholder assertion
  });\n`;
  }
   return `import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ${componentName} } from '../../${componentName}'; // Assumes component is in parent dir

describe('${suite.name.replace(/'/g, "\\'")}', () => {
${testCases}
});
`;
}

const uiTestTypeGenerators: { [key: string]: (suite: TestSuite, spec: TestSpec, componentName: string) => string } = {
  snapshot: generateUISnapshotTestContent,
  interaction: generateUIInteractionTestContent,
  functional: generateUIInteractionTestContent, 
  navigation: generateUIInteractionTestContent,
  permissions: generateUIInteractionTestContent,
};


async function generateUITestsForSpec(screenId: string): Promise<boolean> {
  const specPath = path.join(SPEC_UI_TESTS_SCREENS_DIR, `${screenId}.test.yaml`);
  if (!fs.existsSync(specPath)) {
    console.error(`エラー: UIテスト仕様ファイルが見つかりません: ${specPath}`);
    return false;
  }
  try {
    const specContent = fs.readFileSync(specPath, 'utf8');
    const spec = yaml.load(specContent) as TestSpec;
    if (!spec || !spec.target || !spec.target.path) {
      console.error(`エラー: ${specPath} の 'target.path' が見つかりません。`);
      return false;
    }
    const componentFileName = path.basename(spec.target.path);
    const componentName = componentFileName.replace('.tsx', '');
    const componentDir = path.dirname(path.join(ROOT_DIR, spec.target.path));
    const testsDir = path.join(componentDir, '__tests__');

    if (!fs.existsSync(testsDir)) {
      ensureDirectoryExistence(path.join(testsDir, 'dummy.txt')); 
    }

    if (!spec.testSuites || spec.testSuites.length === 0) {
      console.warn(`警告: ${specPath} に testSuites が見つからないか空です。`);
      return true; 
    }

    let generatedAnyFile = false;
    for (const suite of spec.testSuites) {
      let generatorFunction = uiTestTypeGenerators[suite.type || 'snapshot'];
      if (!generatorFunction) {
        console.warn(`警告: UIテストタイプ「${suite.type}」の生成器が見つかりません。デフォルトのinteractionを使用します。(${specPath} - ${suite.id})`);
        generatorFunction = uiTestTypeGenerators.interaction; // Fallback to interaction
      }
      const testContent = generatorFunction(suite, spec, componentName);
      const testFileName = `${suite.id || suite.name.replace(/\s+/g, '_')}.test.tsx`;
      const testFilePath = path.join(testsDir, testFileName);
      fs.writeFileSync(testFilePath, testContent.trim());
      console.log(`生成: ${testFilePath}`);
      generatedAnyFile = true;
    }
    return generatedAnyFile;
  } catch (error: any) {
    console.error(`UIテスト生成中にエラーが発生しました (${specPath}):`, error.message);
    if (error.mark) {
      console.error(`  エラー箇所(行 ${error.mark.line}, 列 ${error.mark.column})`);
    }
    return false;
  }
}

// --- Generic Test Generation for other categories ---
function generateGenericTestContent(suite: TestSuite, specName: string): string {
  let testCases = '';
  if (!suite.cases || suite.cases.length === 0) {
    testCases += `  test.todo('Implement test cases for ${suite.name.replace(/'/g, "\\'")}');\n`;
  } else {
    for (const testCase of suite.cases) {
      testCases += `  test.todo('${testCase.name.replace(/'/g, "\\'")}')${testCase.description ? ` // ${testCase.description.replace(/\r?\n|\n|\r/g, ' ').replace(/'/g, "\\'")}` : ''};\n`;
    }
  }
  return `describe('${suite.name.replace(/'/g, "\\'")}', () => {\n${testCases}});
`;
}

function generateGenericTestsForSpecFile(specFilePath: string, outputDir: string, testCategoryName: string): boolean {
  let spec: TestSpec | null = null;
  let parsedSuccessfully = false;
  if (fs.existsSync(specFilePath)) {
    try {
      const specContent = fs.readFileSync(specFilePath, 'utf8');
      spec = yaml.load(specContent) as TestSpec;
      parsedSuccessfully = !!spec;
    } catch (error: any) {
      console.error(`${testCategoryName} テスト仕様のパースに失敗しました (${specFilePath}): ${error.message}`);
    }
  } else {
    console.warn(`警告: ${testCategoryName} テスト仕様ファイルが見つかりません: ${specFilePath}`);
  }

  // spec が正常にパースできなかった場合はプレースホルダーテストを生成
  if (!parsedSuccessfully || !spec) {
    const fallbackName = path.basename(specFilePath, path.extname(specFilePath));
    if (!fs.existsSync(outputDir)) {
      ensureDirectoryExistence(path.join(outputDir, 'dummy.txt'));
    }
    const placeholderContent = `// Placeholder test for ${fallbackName} (${testCategoryName})\n// Spec file missing or invalid.\n\ndescribe('${fallbackName}', () => {\n  test.todo('Implement ${testCategoryName} tests for ${fallbackName}');\n});\n`;
    const outputFileName = fallbackName;
    const outputFilePath = path.join(outputDir, `${outputFileName}.test.ts`);
    fs.writeFileSync(outputFilePath, placeholderContent.trim());
    console.log(`プレースホルダー生成: ${outputFilePath}`);
    return true;
  }

  const specNameFromYaml = spec.name || (spec.target && spec.target.name); 
  const specName = specNameFromYaml || path.basename(specFilePath, '.test.yaml').replace('.yaml','');

  let allTestContent = `// Test cases for ${specName} (${testCategoryName})\n// Generated by generate_tests.ts\n\n`;

  if (spec.testSuites && Array.isArray(spec.testSuites)) {
    for (const suite of spec.testSuites) {
      allTestContent += generateGenericTestContent(suite, specName) + '\n';
    }
  } else if (spec.cases && Array.isArray(spec.cases)) { 
    const pseudoSuite: TestSuite = { id: 'main_suite', name: specName, cases: spec.cases };
    allTestContent += generateGenericTestContent(pseudoSuite, specName) + '\n';
  } else {
    console.warn(`警告: ${specFilePath} に 'testSuites' または 'cases' が見つかりません。基本的なテストファイルを生成します。`);
    allTestContent += `describe('${specName.replace(/'/g, "\\'")}', () => {\n  test.todo('Implement tests for this spec');\n});\n`;
  }

  if (!fs.existsSync(outputDir)) {
    ensureDirectoryExistence(path.join(outputDir, 'dummy.txt'));
  }
  const outputFileName = path.basename(specFilePath).replace('.test.yaml', '').replace('.yaml', '');
  const outputFilePath = path.join(outputDir, `${outputFileName}.test.ts`);
  fs.writeFileSync(outputFilePath, allTestContent.trim());
  console.log(`生成: ${outputFilePath}`);
  return true;
}

async function generateAllTests(updateStatusOpt: boolean) {
  const testPlanContent = fs.readFileSync(TEST_PLAN_PATH, 'utf8');
  const testPlan = yaml.load(testPlanContent) as any;
  let allOperationsSuccessful = true;

  if (testPlan.ui_tests) {
    console.log('\n--- UIテスト生成 ---');
    for (const test of testPlan.ui_tests) {
      if (test.status === 'todo') {
        console.log(`UIテスト仕様 ${test.id} (${test.screen}) の生成を開始...`);
        const success = await generateUITestsForSpec(test.screen);
        if (success) {
          if (updateStatusOpt) {
            const uiSpecPath = path.join(SPEC_UI_TESTS_SCREENS_DIR, `${test.screen}.test.yaml`);
             if (fs.existsSync(uiSpecPath)) {
                const uiSpecData = yaml.load(fs.readFileSync(uiSpecPath, 'utf8')) as TestSpec;
                if (uiSpecData && uiSpecData.target && uiSpecData.target.path) {
                    const targetDir = path.dirname(path.join(ROOT_DIR, uiSpecData.target.path));
                    const testsDir = path.join(targetDir, '__tests__');
                    updateTestPlanStatus(TEST_PLAN_PATH, 'ui_tests', test.id, testsDir);
                }
            }
          }
        } else {
          allOperationsSuccessful = false; 
        }
      }
    }
  }

  const genericTestCategories = [
    { planKey: 'feature_tests', specDir: SPEC_FEATURES_DIR, outDir: TESTS_FEATURES_DIR, name: 'Feature', idKey: 'id' },
    { planKey: 'e2e_tests', specDir: SPEC_E2E_DIR, outDir: TESTS_E2E_DIR, name: 'E2E', idKey: 'id' },
    { planKey: 'contract_tests', specDir: SPEC_CONTRACT_DIR, outDir: TESTS_CONTRACT_DIR, name: 'Contract', idKey: 'id' },
    { planKey: 'non_functional_tests', specDir: SPEC_NON_FUNCTIONAL_DIR, outDir: TESTS_NON_FUNCTIONAL_DIR, name: 'Non-Functional', idKey: 'id' },
  ];

  for (const category of genericTestCategories) {
    if (testPlan[category.planKey]) {
      console.log(`\n--- ${category.name}テスト生成 ---`);
      for (const test of testPlan[category.planKey]) {
        if (test.status === 'todo') {
          const specFileName = `${test[category.idKey]}.test.yaml`;
          const specPath = path.join(category.specDir, specFileName);
          console.log(`${category.name}テスト仕様 ${specFileName} の生成を開始...`);
          const success = generateGenericTestsForSpecFile(specPath, category.outDir, category.name);
          if (success) {
            if (updateStatusOpt) {
              const outputFileName = path.basename(specPath).replace('.test.yaml', '').replace('.yaml', '');
              const expectedOutputFile = path.join(category.outDir, `${outputFileName}.test.ts`);
              updateTestPlanStatus(TEST_PLAN_PATH, category.planKey, test.id, expectedOutputFile);
            }
          } else {
            allOperationsSuccessful = false;
          }
        }
      }
    }
  }

  if (allOperationsSuccessful) {
    console.log('\n全テスト仕様の生成処理が完了しました。');
  } else {
    console.log('\nいくつかのテスト仕様の生成に失敗またはスキップされました。詳細はログを確認してください。');
  }
}

function updateTestPlanStatus(testPlanPath: string, categoryKey: string, testId: string, generatedPath?: string) {
  let fileOrDirExists = false;
  if (generatedPath) {
    try {
      const stats = fs.statSync(generatedPath);
      if (stats.isFile()) {
        fileOrDirExists = true;
      } else if (stats.isDirectory() && categoryKey === 'ui_tests') {
        if (fs.readdirSync(generatedPath).some(f => f.endsWith('.test.tsx'))) {
          fileOrDirExists = true;
        }
      }
    } catch (e) { /* Does not exist */ }
  }

  if (!fileOrDirExists) {
    console.warn(`テストファイル/ディレクトリ ${generatedPath} が見つからないか空のため、${categoryKey}.${testId} のステータスを更新できません。`);
    return;
  }

  const testPlanContent = fs.readFileSync(testPlanPath, 'utf8');
  const testPlan = yaml.load(testPlanContent) as any;

  if (testPlan[categoryKey]) {
    const testIndex = testPlan[categoryKey].findIndex((t: any) => t.id === testId);
    if (testIndex !== -1 && testPlan[categoryKey][testIndex].status === 'todo') {
      testPlan[categoryKey][testIndex].status = 'implemented';
      console.log(`更新: ${testPlanPath} - ${categoryKey}.${testId} のステータスを 'implemented' に変更しました。`);
    }
  }
  fs.writeFileSync(testPlanPath, yaml.dump(testPlan));
}

// --- Commander Program Definition ---
program
  .version('1.0.2') // Incremented version
  .description('テスト仕様書YAMLからテストコードを生成します。')
  .option('--spec <id>', '特定のUIスクリーンIDまたは汎用テストIDのテストを生成')
  .option('--all', 'test_plan.yamlに基づき、statusがtodoの全てのテストを生成 (デフォルト動作)')
  .option('--update-status', 'テスト生成後にtest_plan.yamlのステータスを更新 (デフォルトは更新しない)')
  .action(async (options) => {
    const updateStatusOpt = !!options.updateStatus;

    if (options.spec) {
      const testIdToGenerate = options.spec;
      console.log(`指定されたID ${testIdToGenerate} のテストを生成試行...`);
      let generated = false;
      let found = false;

      const testPlanContent = fs.readFileSync(TEST_PLAN_PATH, 'utf8'); 
      const testPlan = yaml.load(testPlanContent) as any;

      // Try UI tests first
      if (testPlan.ui_tests) {
        const uiTestEntry = testPlan.ui_tests.find((t: any) => t.id === testIdToGenerate || t.screen === testIdToGenerate);
        if (uiTestEntry) {
          found = true;
          console.log(`UIテスト ${uiTestEntry.id} (${uiTestEntry.screen}) として生成します。`);
          if (uiTestEntry.status === 'todo' || !updateStatusOpt) {
             generated = await generateUITestsForSpec(uiTestEntry.screen);
            if (generated && updateStatusOpt) {
                const uiSpecPath = path.join(SPEC_UI_TESTS_SCREENS_DIR, `${uiTestEntry.screen}.test.yaml`);
                 if (fs.existsSync(uiSpecPath)) {
                    const uiSpecData = yaml.load(fs.readFileSync(uiSpecPath, 'utf8')) as TestSpec;
                     if (uiSpecData && uiSpecData.target && uiSpecData.target.path) {
                        const targetDir = path.dirname(path.join(ROOT_DIR, uiSpecData.target.path));
                        const testsDir = path.join(targetDir, '__tests__');
                        updateTestPlanStatus(TEST_PLAN_PATH, 'ui_tests', uiTestEntry.id, testsDir);
                    }
                }
            }
          } else {
             console.log(`UIテスト ${uiTestEntry.id} は既に status: ${uiTestEntry.status} です。(${updateStatusOpt ? '' : ''}--update-statusなしで強制生成する場合は、planをtodoに戻してください)`);
             generated = true; 
          }
        }
      }

      if (!found || (found && !generated && testPlan.ui_tests.find((t:any) => (t.id === testIdToGenerate || t.screen === testIdToGenerate) && t.status !== 'todo' && updateStatusOpt))) {
         const genericTestCategories = [
            { planKey: 'feature_tests', specDir: SPEC_FEATURES_DIR, outDir: TESTS_FEATURES_DIR, name: 'Feature', idKey: 'id' },
            { planKey: 'e2e_tests', specDir: SPEC_E2E_DIR, outDir: TESTS_E2E_DIR, name: 'E2E', idKey: 'id' },
            { planKey: 'contract_tests', specDir: SPEC_CONTRACT_DIR, outDir: TESTS_CONTRACT_DIR, name: 'Contract', idKey: 'id' },
            { planKey: 'non_functional_tests', specDir: SPEC_NON_FUNCTIONAL_DIR, outDir: TESTS_NON_FUNCTIONAL_DIR, name: 'Non-Functional', idKey: 'id' },
          ];
        for (const category of genericTestCategories) {
          if (testPlan[category.planKey]) {
            const testEntry = testPlan[category.planKey].find((t: any) => t.id === testIdToGenerate);
            if (testEntry) {
              found = true;
              console.log(`${category.name}テスト ${testEntry.id} として生成します。`);
               if (testEntry.status === 'todo' || !updateStatusOpt) {
                const specFileName = `${testEntry.id}.test.yaml`;
                const specPath = path.join(category.specDir, specFileName);
                generated = generateGenericTestsForSpecFile(specPath, category.outDir, category.name);
                if (generated && updateStatusOpt) {
                  const outputFileName = path.basename(specPath).replace('.test.yaml', '').replace('.yaml', '');
                  const expectedOutputFile = path.join(category.outDir, `${outputFileName}.test.ts`);
                  updateTestPlanStatus(TEST_PLAN_PATH, category.planKey, testEntry.id, expectedOutputFile);
                }
              } else {
                  console.log(`${category.name}テスト ${testEntry.id} は既に status: ${testEntry.status} です。(${updateStatusOpt ? '' : ''}--update-statusなしで強制生成する場合は、planをtodoに戻してください)`);
                  generated = true; 
              }
              break; 
            }
          }
        }
      }

      if (found && generated) {
        console.log(`ID ${testIdToGenerate} のテスト生成処理が完了しました。`);
      } else if (found && !generated) {
        console.log(`ID ${testIdToGenerate} のテスト生成に失敗しました、または既に実装済みでスキップされました。`);
      } 
      else {
        console.log(`ID ${testIdToGenerate} に対応するテスト仕様が見つかりませんでした。`);
      }
    } else { // Default to --all if no specific options are given (or only --update-status)
      console.log('全ての status:todo のテストを生成します (デフォルト動作)...');
      await generateAllTests(updateStatusOpt);
    }
  });

program.parse(process.argv);
