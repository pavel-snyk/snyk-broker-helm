/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  repositoryUrl: 'https://github.com/pavel-snyk/snyk-broker-helm.git',
  tagFormat: 'snyk-broker-${version}',
  prepare: [
    [
      // prepare folders for charts and index file (needed for chart-releaser)
      '@semantic-release/exec',
      {
        prepareCmd: 'mkdir -p .cr-release-packages/ && mkdir -p .cr-index/',
      },
    ],
    [
      // package the chart into a versioned chart archive file
      '@semantic-release/exec',
      {
        prepareCmd: 'helm package charts/snyk-broker/ --destination .cr-release-packages/ --version ${nextRelease.version}',
      },
    ],
  ],
  publish: [
    [
      // upload the chart package to GitHub Releases
      '@semantic-release/exec',
      {
        publishCmd: 'cr upload --owner pavel-snyk --git-repo snyk-broker-helm --generate-release-notes --push --skip-existing --token $GH_TOKEN',
      },
    ],
    [
      // update the chart repository index.yaml file based on given GitHub release.
      '@semantic-release/exec',
      {
        publishCmd: 'cr index --owner pavel-snyk --git-repo snyk-broker-helm --push --token $GH_TOKEN',
      },
    ]
  ],
}
