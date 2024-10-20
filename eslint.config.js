import path from 'node:path'
import url from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

export default [
  ...(new FlatCompat({
    baseDirectory: path.dirname(url.fileURLToPath(import.meta.url))
  }).extends('eslint-config-standard')),
  {
    rules: {
      'max-len': ['error', { code: 80 }],
      'import/order': ['error', {
        groups: [
          ['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']
        ],
        'newlines-between': 'always'
      }],
      'object-shorthand': ['error', 'always']
    }
  }
]
