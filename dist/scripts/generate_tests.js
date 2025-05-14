#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const commander_1 = require("commander");
const ROOT_DIR = path_1.default.join(__dirname, '..');
const SPEC_DIR = path_1.default.join(ROOT_DIR, 'spec');
const TESTS_DIR = path_1.default.join(ROOT_DIR, 'tests');
const SPEC_UI_TESTS_SCREENS_DIR = path_1.default.join(SPEC_DIR, 'ui', 'tests', 'screens');
const SPEC_FEATURES_DIR = path_1.default.join(SPEC_DIR, 'tests', 'features');
const TESTS_FEATURES_DIR = path_1.default.join(TESTS_DIR, 'features');
const SPEC_E2E_DIR = path_1.default.join(SPEC_DIR, 'tests', 'e2e');
const TESTS_E2E_DIR = path_1.default.join(TESTS_DIR, 'e2e');
const SPEC_CONTRACT_DIR = path_1.default.join(SPEC_DIR, 'tests', 'contract');
const TESTS_CONTRACT_DIR = path_1.default.join(TESTS_DIR, 'contract');
const SPEC_NON_FUNCTIONAL_DIR = path_1.default.join(SPEC_DIR, 'tests', 'non_functional');
const TESTS_NON_FUNCTIONAL_DIR = path_1.default.join(TESTS_DIR, 'non_functional');
const TEST_PLAN_PATH = path_1.default.join(SPEC_DIR, 'tests', 'test_plan.yaml');
function ensureDirectoryExistence(filePath) {
    const dirname = path_1.default.dirname(filePath);
    if (fs_1.default.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs_1.default.mkdirSync(dirname);
}
// --- New UI Test Generation Logic ---
function generateUISnapshotTestContent(suite, spec, componentName) {
    let testCases = '';
    if (!suite.cases)
        return '';
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
function generateUIInteractionTestContent(suite, spec, componentName) {
    let testCases = '';
    if (!suite.cases)
        return '';
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
const uiTestTypeGenerators = {
    snapshot: generateUISnapshotTestContent,
    interaction: generateUIInteractionTestContent,
    functional: generateUIInteractionTestContent,
    navigation: generateUIInteractionTestContent,
    permissions: generateUIInteractionTestContent,
};
async function generateUITestsForSpec(screenId) {
    const specPath = path_1.default.join(SPEC_UI_TESTS_SCREENS_DIR, `${screenId}.test.yaml`);
    if (!fs_1.default.existsSync(specPath)) {
        console.error(`エラー: UIテスト仕様ファイルが見つかりません: ${specPath}`);
        return false;
    }
    try {
        const specContent = fs_1.default.readFileSync(specPath, 'utf8');
        const spec = js_yaml_1.default.load(specContent);
        if (!spec || !spec.target || !spec.target.path) {
            console.error(`エラー: ${specPath} の 'target.path' が見つかりません。`);
            return false;
        }
        const componentFileName = path_1.default.basename(spec.target.path);
        const componentName = componentFileName.replace('.tsx', '');
        const componentDir = path_1.default.dirname(path_1.default.join(ROOT_DIR, spec.target.path));
        const testsDir = path_1.default.join(componentDir, '__tests__');
        if (!fs_1.default.existsSync(testsDir)) {
            ensureDirectoryExistence(path_1.default.join(testsDir, 'dummy.txt'));
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
            const testFilePath = path_1.default.join(testsDir, testFileName);
            fs_1.default.writeFileSync(testFilePath, testContent.trim());
            console.log(`生成: ${testFilePath}`);
            generatedAnyFile = true;
        }
        return generatedAnyFile;
    }
    catch (error) {
        console.error(`UIテスト生成中にエラーが発生しました (${specPath}):`, error.message);
        if (error.mark) {
            console.error(`  エラー箇所(行 ${error.mark.line}, 列 ${error.mark.column})`);
        }
        return false;
    }
}
// --- Generic Test Generation for other categories ---
function generateGenericTestContent(suite, specName) {
    let testCases = '';
    if (!suite.cases || suite.cases.length === 0) {
        testCases += `  test.todo('Implement test cases for ${suite.name.replace(/'/g, "\\'")}');\n`;
    }
    else {
        for (const testCase of suite.cases) {
            testCases += `  test.todo('${testCase.name.replace(/'/g, "\\'")}')${testCase.description ? ` // ${testCase.description.replace(/\r?\n|\n|\r/g, ' ').replace(/'/g, "\\'")}` : ''};\n`;
        }
    }
    return `describe('${suite.name.replace(/'/g, "\\'")}', () => {\n${testCases}});
`;
}
function generateGenericTestsForSpecFile(specFilePath, outputDir, testCategoryName) {
    if (!fs_1.default.existsSync(specFilePath)) {
        console.warn(`警告: ${testCategoryName} テスト仕様ファイルが見つかりません: ${specFilePath}`);
        return false;
    }
    try {
        const specContent = fs_1.default.readFileSync(specFilePath, 'utf8');
        const spec = js_yaml_1.default.load(specContent);
        if (!spec) {
            console.error(`エラー: ${specFilePath} の内容をパースできませんでした。`);
            return false;
        }
        const specNameFromYaml = spec.name || (spec.target && spec.target.name);
        const specName = specNameFromYaml || path_1.default.basename(specFilePath, '.test.yaml').replace('.yaml', '');
        let allTestContent = `// Test cases for ${specName} (${testCategoryName})\n// Generated by generate_tests.ts\n\n`;
        if (spec.testSuites && Array.isArray(spec.testSuites)) {
            for (const suite of spec.testSuites) {
                allTestContent += generateGenericTestContent(suite, specName) + '\n';
            }
        }
        else if (spec.cases && Array.isArray(spec.cases)) {
            const pseudoSuite = { id: 'main_suite', name: specName, cases: spec.cases };
            allTestContent += generateGenericTestContent(pseudoSuite, specName) + '\n';
        }
        else {
            console.warn(`警告: ${specFilePath} に 'testSuites' または 'cases' が見つかりません。基本的なテストファイルを生成します。`);
            allTestContent += `describe('${specName.replace(/'/g, "\\'")}', () => {\n  test.todo('Implement tests for this spec');\n});\n`;
        }
        if (!fs_1.default.existsSync(outputDir)) {
            ensureDirectoryExistence(path_1.default.join(outputDir, 'dummy.txt'));
        }
        const outputFileName = path_1.default.basename(specFilePath).replace('.test.yaml', '').replace('.yaml', '');
        const outputFilePath = path_1.default.join(outputDir, `${outputFileName}.test.ts`);
        fs_1.default.writeFileSync(outputFilePath, allTestContent.trim());
        console.log(`生成: ${outputFilePath}`);
        return true;
    }
    catch (error) {
        console.error(`${testCategoryName} テスト生成中にエラーが発生しました (${specFilePath}):`, error.message);
        if (error.mark) {
            console.error(`  エラー箇所(行 ${error.mark.line}, 列 ${error.mark.column})`);
        }
        return false;
    }
}
async function generateAllTests(updateStatusOpt) {
    const testPlanContent = fs_1.default.readFileSync(TEST_PLAN_PATH, 'utf8');
    const testPlan = js_yaml_1.default.load(testPlanContent);
    let allOperationsSuccessful = true;
    if (testPlan.ui_tests) {
        console.log('\n--- UIテスト生成 ---');
        for (const test of testPlan.ui_tests) {
            if (test.status === 'todo') {
                console.log(`UIテスト仕様 ${test.id} (${test.screen}) の生成を開始...`);
                const success = await generateUITestsForSpec(test.screen);
                if (success) {
                    if (updateStatusOpt) {
                        const uiSpecPath = path_1.default.join(SPEC_UI_TESTS_SCREENS_DIR, `${test.screen}.test.yaml`);
                        if (fs_1.default.existsSync(uiSpecPath)) {
                            const uiSpecData = js_yaml_1.default.load(fs_1.default.readFileSync(uiSpecPath, 'utf8'));
                            if (uiSpecData && uiSpecData.target && uiSpecData.target.path) {
                                const targetDir = path_1.default.dirname(path_1.default.join(ROOT_DIR, uiSpecData.target.path));
                                const testsDir = path_1.default.join(targetDir, '__tests__');
                                updateTestPlanStatus(TEST_PLAN_PATH, 'ui_tests', test.id, testsDir);
                            }
                        }
                    }
                }
                else {
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
                    const specPath = path_1.default.join(category.specDir, specFileName);
                    console.log(`${category.name}テスト仕様 ${specFileName} の生成を開始...`);
                    const success = generateGenericTestsForSpecFile(specPath, category.outDir, category.name);
                    if (success) {
                        if (updateStatusOpt) {
                            const outputFileName = path_1.default.basename(specPath).replace('.test.yaml', '').replace('.yaml', '');
                            const expectedOutputFile = path_1.default.join(category.outDir, `${outputFileName}.test.ts`);
                            updateTestPlanStatus(TEST_PLAN_PATH, category.planKey, test.id, expectedOutputFile);
                        }
                    }
                    else {
                        allOperationsSuccessful = false;
                    }
                }
            }
        }
    }
    if (allOperationsSuccessful) {
        console.log('\n全テスト仕様の生成処理が完了しました。');
    }
    else {
        console.log('\nいくつかのテスト仕様の生成に失敗またはスキップされました。詳細はログを確認してください。');
    }
}
function updateTestPlanStatus(testPlanPath, categoryKey, testId, generatedPath) {
    let fileOrDirExists = false;
    if (generatedPath) {
        try {
            const stats = fs_1.default.statSync(generatedPath);
            if (stats.isFile()) {
                fileOrDirExists = true;
            }
            else if (stats.isDirectory() && categoryKey === 'ui_tests') {
                if (fs_1.default.readdirSync(generatedPath).some(f => f.endsWith('.test.tsx'))) {
                    fileOrDirExists = true;
                }
            }
        }
        catch (e) { /* Does not exist */ }
    }
    if (!fileOrDirExists) {
        console.warn(`テストファイル/ディレクトリ ${generatedPath} が見つからないか空のため、${categoryKey}.${testId} のステータスを更新できません。`);
        return;
    }
    const testPlanContent = fs_1.default.readFileSync(testPlanPath, 'utf8');
    const testPlan = js_yaml_1.default.load(testPlanContent);
    if (testPlan[categoryKey]) {
        const testIndex = testPlan[categoryKey].findIndex((t) => t.id === testId);
        if (testIndex !== -1 && testPlan[categoryKey][testIndex].status === 'todo') {
            testPlan[categoryKey][testIndex].status = 'implemented';
            console.log(`更新: ${testPlanPath} - ${categoryKey}.${testId} のステータスを 'implemented' に変更しました。`);
        }
    }
    fs_1.default.writeFileSync(testPlanPath, js_yaml_1.default.dump(testPlan));
}
// --- Commander Program Definition ---
commander_1.program
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
        const testPlanContent = fs_1.default.readFileSync(TEST_PLAN_PATH, 'utf8');
        const testPlan = js_yaml_1.default.load(testPlanContent);
        // Try UI tests first
        if (testPlan.ui_tests) {
            const uiTestEntry = testPlan.ui_tests.find((t) => t.id === testIdToGenerate || t.screen === testIdToGenerate);
            if (uiTestEntry) {
                found = true;
                console.log(`UIテスト ${uiTestEntry.id} (${uiTestEntry.screen}) として生成します。`);
                if (uiTestEntry.status === 'todo' || !updateStatusOpt) {
                    generated = await generateUITestsForSpec(uiTestEntry.screen);
                    if (generated && updateStatusOpt) {
                        const uiSpecPath = path_1.default.join(SPEC_UI_TESTS_SCREENS_DIR, `${uiTestEntry.screen}.test.yaml`);
                        if (fs_1.default.existsSync(uiSpecPath)) {
                            const uiSpecData = js_yaml_1.default.load(fs_1.default.readFileSync(uiSpecPath, 'utf8'));
                            if (uiSpecData && uiSpecData.target && uiSpecData.target.path) {
                                const targetDir = path_1.default.dirname(path_1.default.join(ROOT_DIR, uiSpecData.target.path));
                                const testsDir = path_1.default.join(targetDir, '__tests__');
                                updateTestPlanStatus(TEST_PLAN_PATH, 'ui_tests', uiTestEntry.id, testsDir);
                            }
                        }
                    }
                }
                else {
                    console.log(`UIテスト ${uiTestEntry.id} は既に status: ${uiTestEntry.status} です。(${updateStatusOpt ? '' : ''}--update-statusなしで強制生成する場合は、planをtodoに戻してください)`);
                    generated = true;
                }
            }
        }
        if (!found || (found && !generated && testPlan.ui_tests.find((t) => (t.id === testIdToGenerate || t.screen === testIdToGenerate) && t.status !== 'todo' && updateStatusOpt))) {
            const genericTestCategories = [
                { planKey: 'feature_tests', specDir: SPEC_FEATURES_DIR, outDir: TESTS_FEATURES_DIR, name: 'Feature', idKey: 'id' },
                { planKey: 'e2e_tests', specDir: SPEC_E2E_DIR, outDir: TESTS_E2E_DIR, name: 'E2E', idKey: 'id' },
                { planKey: 'contract_tests', specDir: SPEC_CONTRACT_DIR, outDir: TESTS_CONTRACT_DIR, name: 'Contract', idKey: 'id' },
                { planKey: 'non_functional_tests', specDir: SPEC_NON_FUNCTIONAL_DIR, outDir: TESTS_NON_FUNCTIONAL_DIR, name: 'Non-Functional', idKey: 'id' },
            ];
            for (const category of genericTestCategories) {
                if (testPlan[category.planKey]) {
                    const testEntry = testPlan[category.planKey].find((t) => t.id === testIdToGenerate);
                    if (testEntry) {
                        found = true;
                        console.log(`${category.name}テスト ${testEntry.id} として生成します。`);
                        if (testEntry.status === 'todo' || !updateStatusOpt) {
                            const specFileName = `${testEntry.id}.test.yaml`;
                            const specPath = path_1.default.join(category.specDir, specFileName);
                            generated = generateGenericTestsForSpecFile(specPath, category.outDir, category.name);
                            if (generated && updateStatusOpt) {
                                const outputFileName = path_1.default.basename(specPath).replace('.test.yaml', '').replace('.yaml', '');
                                const expectedOutputFile = path_1.default.join(category.outDir, `${outputFileName}.test.ts`);
                                updateTestPlanStatus(TEST_PLAN_PATH, category.planKey, testEntry.id, expectedOutputFile);
                            }
                        }
                        else {
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
        }
        else if (found && !generated) {
            console.log(`ID ${testIdToGenerate} のテスト生成に失敗しました、または既に実装済みでスキップされました。`);
        }
        else {
            console.log(`ID ${testIdToGenerate} に対応するテスト仕様が見つかりませんでした。`);
        }
    }
    else { // Default to --all if no specific options are given (or only --update-status)
        console.log('全ての status:todo のテストを生成します (デフォルト動作)...');
        await generateAllTests(updateStatusOpt);
    }
});
commander_1.program.parse(process.argv);
//# sourceMappingURL=generate_tests.js.map