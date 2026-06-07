const fs = require('fs');

const reportPath = 'C:\\Users\\ruslan.katz\\OneDrive - Brainlab SE\\Documents\\templates-report.js';
const configsPath = 'D:\\projects\\tcn-qa\\public\\mocks\\configs.json';

const reportContent = fs.readFileSync(reportPath, 'utf8');
const report = eval('(' + reportContent + ')');

const configs = JSON.parse(fs.readFileSync(configsPath, 'utf8'));

const procedures = new Set(configs.templateConfigurations.procedures);
const anatomicalRegions = new Set(configs.templateConfigurations.anatomicalRegions);

for (const failed of report.faileds) {
  if (failed.procedure) {
    procedures.add(failed.procedure);
  }
  if (failed.anatomicalRegion) {
    for (const region of failed.anatomicalRegion.split(';')) {
      const trimmed = region.trim();
      if (trimmed) anatomicalRegions.add(trimmed);
    }
  }
}

configs.templateConfigurations.procedures = [...procedures].sort();
configs.templateConfigurations.anatomicalRegions = [...anatomicalRegions].sort();

fs.writeFileSync(configsPath, JSON.stringify(configs, null, 2), 'utf8');

console.log('procedures:', configs.templateConfigurations.procedures.length);
console.log('anatomicalRegions:', configs.templateConfigurations.anatomicalRegions.length);
