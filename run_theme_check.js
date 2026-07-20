const { execSync } = require('child_process');
try {
    const stdout = execSync('npx shopify theme check', { cwd: 'theme' });
    console.log(stdout.toString());
} catch (error) {
    if (error.stdout) console.log(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
}
