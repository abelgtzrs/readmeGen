// TODO: Include packages needed for this application
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

// TODO: Create an array of questions for user input
const questions = [
    {
        type: 'input',
        name: 'projectTitle',
        message: 'What is the title of your project?',
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: 'Write a brief description of your project?',
      },
      {
        type: 'input',
        name: 'projectInstallation',
        message: 'What are the installation instructions for your project?',
      },
      {
        type: 'input',
        name: 'projectUsage',
        message: 'Describe the usage of your project.',
      },
      {
        type: 'input',
        name: 'projectContribution',
        message: 'What are the contribution guidelines of your project?',
      },
      {
        type: 'input',
        name: 'projectTest',
        message: 'What are the test instructions of your project?',
      },
      {
        type: 'list',
        name: 'projectLicense',
        message: 'What is the license for your project?',
        choices: ['MIT License', 'Apache License 2.0', 'GNU General Public License v3.0', 'BSD 2-Clause "Simplified" License', 'BSD 3-Clause "New" or "Revised" License', 'Boot Software License 1.0', 'None'],
      },
      {
        type: 'input',
        name: 'projectGithub',
        message: 'Enter your Github Account.',
      },
      {
        type: 'input',
        name: 'projectEmail',
        message: 'Enter your e-mail address.',
      },
];

//Function to ask for individual features of the project
function addFeatures(features = []) {
  return inquirer.prompt({
    type: 'input',
    name: 'feature',
    message: 'Enter a feature (or leave blank to finish):',
  }).then(({ feature }) => {
    if (feature) {
      features.push(feature);
      return addFeatures(features);
    }
    return features;
  });
}
//Function to ask for the contributors
function addContributors(contributors = []) {
  return inquirer.prompt({
    type: 'input',
    name: 'contributor',
    message: 'Enter a contributor (or leave blank to finish):',
  }).then(({ contributor }) => {
    if (contributor) {
      contributors.push(contributor);
      return addContributors(contributors);
    }
    return contributors;
  });
}

// TODO: Create a function to write README file
function writeToFile(fileName, data) {
  const outputDir = path.join(process.cwd(), 'examples');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, data, (err) => {
    if (err) {
      console.error(`Error writing to file. ${err}`);
    } else {
      console.log(`Wrote to: ${filePath}`);
    }
  });
}

function generateMarkdown(data) {
  return `# ${data.title}

## Description
${data.description}

## Installation
${data.installation}

## Usage
${data.usage}

## License
${data.license}

## Contributing
${data.contributing}

## Tests
${data.tests}

## Features
${data.features.map((feature) => `- ${feature}`).join('\n')}

## Contributors
${data.contributors.map((contributor) => `- ${contributor}`).join('\n')}

## Questions
For any questions, you can reach me at:
- GitHub: [${data.github}](https://github.com/${data.github})
- Email: ${data.email}
`;
}

// TODO: Create a function to initialize app
function init() {
  inquirer.prompt(questions).then((answers) => {
      console.log('\n--- Adding Features ---');
      return addFeatures().then((features) => {
        console.log('\n--- Adding Contributors ---');
        return addContributors().then((contributors) => {
          const fullData = {
            title: answers.projectTitle,
            description: answers.projectDescription,
            installation: answers.projectInstallation,
            usage: answers.projectUsage,
            contributing: answers.projectContribution,
            tests: answers.projectTest,
            license: answers.projectLicense,
            github: answers.projectGithub,
            email: answers.projectEmail,
            features,
            contributors
          };
          
          const markdown = generateMarkdown(fullData);
          writeToFile(`${fullData.title}README.md`, markdown);
        });
      });
    })
    .catch((error) => {
      console.error('Error occurred during prompts:', error);
    });
}


// Function call to initialize app
init();
