/* eslint-disable */
const minimumMajorVersion = 14;

try {
  const majorVersion = Number.parseInt(process.versions.node.split('.')[0], 10);

  if (Number.isNaN(majorVersion)) {
    throw new Error('Unable to parse Node.js version');
  }

  if (majorVersion < minimumMajorVersion) {
    console.error(
      `Required Node.js version >=v${minimumMajorVersion} not satisfied with current version ${process.version}.`
    );
    process.exit(1);
  }
} catch {
  console.error(`Unable to validate Node.js version. Note that Charcoal requires v14 or higher.`);
}
