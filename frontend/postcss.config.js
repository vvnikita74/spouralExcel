import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import flexbugsFixes from 'postcss-flexbugs-fixes'
import cssnano from 'cssnano'
import postcssPresetEnv from 'postcss-preset-env'

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    flexbugsFixes(),
    cssnano({
      preset: 'default'
    }),
    postcssPresetEnv({
      stage: 2,
      features: {
        'nesting-rules': true,
        'gap-properties': true,
        'custom-properties': true,
        'custom-media-queries': true
      }
    })
  ]
}
