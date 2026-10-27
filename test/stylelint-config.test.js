import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import stylelint from 'stylelint'

const configFile = fileURLToPath(new URL('../.stylelintrc.default.yml', import.meta.url))

async function lint(code) {
  const { results } = await stylelint.lint({ code, codeFilename: 'test.scss', configFile })
  return results[0].warnings
}

test('Sass BEM suffix nesting passes the default stylelint config', async () => {
  const code = `.vm-teaser {
  &--featured {
    .date-separator {
      color: #000;
    }
  }

  &__title {
    .link {
      color: #fff;
    }
  }
}

.btn:where(input) {
  color: #000;
}
`
  assert.deepEqual(await lint(code), [])
})
