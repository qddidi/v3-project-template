## ESlint

ESLint 是在 ECMAScript/JavaScript 代码中识别和报告模式匹配的工具，它的目标是保证代码的一致性和避免错误,它的使用其实很简单

首先安装 ESLint

```
pnpm i eslint -D
```

然后进行初始化

```
npx eslint --init
```

你会发现出现一些选择项

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f71818113d44cd6b5ad034562223664~tplv-k3u1fbpfcp-watermark.image?)

因为我们用的是 pnpm,所有那些工具没有安装,我们需要安装一下这些插件

```
pnpm i eslint-plugin-vue@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest -D
```

在`package.json`的`script`中添加命令`lint:script`

```
  "scripts": {
    "lint:script": "eslint --ext .js,.jsx,.vue,.ts,.tsx --fix --quiet ./"
  },
```

直接运行`pnpm run lint:script`会报错,我们需要将`.eslintrc.json`文件下的`"parser": "@typescript-eslint/parser"`

移动到`parserOptions`中,然后新增`parser: vue-eslint-parser`,因为`eslint-plugin-vue`规定如果用了其它解析器则需要将其移动到`parseOptions`下才不会发生冲突,如下

```
{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
    ],
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "parser": "@typescript-eslint/parser"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
}

```

最后执行

```
 pnpm lint:script
```

即可对代码进行校验。

## 集成 Prettier

Prettier 对代码做格式化比较专业,所以 ESLint 经常结合 Prettier 一起使用。

安装

```
pnpm i prettier -D
```

根目录新建.prettierrc.cjs(因为 vite 默认使用了`"type": "module",`,所以这里要以`cjs`后缀结尾)

```
module.exports = {
    printWidth: 80, //一行的字符数，如果超过会进行换行，默认为80
    tabWidth: 2, // 一个 tab 代表几个空格数，默认为 2 个
    useTabs: false, //是否使用 tab 进行缩进，默认为false，表示用空格进行缩减
    singleQuote: true, // 字符串是否使用单引号，默认为 false，使用双引号
    semi: true, // 行尾是否使用分号，默认为true
    trailingComma: "none", // 是否使用尾逗号
    bracketSpacing: true // 对象大括号直接是否有空格，默认为 true，效果：{ a: 1 }
}

```

接下来就是将`Prettier`集成到`ESLint`中

安装`eslint-config-prettier`(覆盖 eslint 本身规则)和`eslint-plugin-prettier`(Prettier 来接管 eslint --fix 即修复代码的能力)

```
pnpm i eslint-config-prettier eslint-plugin-prettier -D
```

配置`.eslintrc.json`(带有注释的部分就是新加的)

```
{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended",
        // 1. 接入 prettier 的规则
        "prettier",
        "plugin:prettier/recommended"
    ],
    "overrides": [],
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "parser": "@typescript-eslint/parser"
    },
    "plugins": [
        "vue",
        "@typescript-eslint",
        "prettier"
    ],
    "rules": {
        // 3. 开启 prettier 自动修复的功能
        "prettier/prettier": "error",
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
}
```

接下来执行

```
pnpm run lint:script
```

即可完成 ESLint 规则校验检查以及 Prettier 的自动修复

## 保存自动格式化

我们通常希望在保存的时候自动执行`lint:script`,这里只需要对`VSCode`进行一个配置即可

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df064ff8a6444bc392b4828071d6a622~tplv-k3u1fbpfcp-watermark.image?)

默认格式化选择`Prettier`,并将保存自动格式化勾选,然后右键选择"使用...格式化文档",设置默认为`Prettier`即可实现保存自动格式化文档

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7535a8cb6cb4e74bc6b55e60c19a9ce~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56b14797e7ff4512afd98c9c3d2cd83f~tplv-k3u1fbpfcp-watermark.image?)

## 在 vite 中引入 ESlint 插件

在 vite 中引入 ESlint 插件原因是因为有些用户不是使用 VSCode 进行开发的,所以我们需要在开发编译阶段就给出提示,引入方式如下

安装`vite-plugin-eslint`

```
pnpm i vite-plugin-eslint -D
```

在`vite.config.ts`使用

```
// vite.config.ts
import viteEslint from 'vite-plugin-eslint';

// 具体配置
{
  plugins: [
    // 省略其它插件
    viteEslint(),
  ]
}
```

此时启动项目如果有 ESLint 错误便可在窗口中提现出来了

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d10b1de0523f41f48d4c6b882d0bf54d~tplv-k3u1fbpfcp-watermark.image?)

## Stylelint 样式规范工具

Stylelint 主要是对 CSS,Less,Scss 等样式代码的规范检查

首先安装对应工具,这里以 scss 为例子

```
pnpm i stylelint stylelint-prettier stylelint-config-standard postcss-scss postcss-html stylelint-config-recommended-vue stylelint-config-recess-order -D
```

然后新建`.stylelintrc.cjs`,如果没有设置`"type": "module"`可以以`.js`结尾

```
module.exports = {
    // 注册 stylelint 的 prettier 插件
    plugins: ['stylelint-prettier'],
    // 继承一系列规则集合
    extends: [
        // standard 规则集合
        'stylelint-config-standard',
        // standard 规则集合的 scss 版本
        'stylelint-config-standard-scss',
        // 样式属性顺序规则
        'stylelint-config-recess-order',
        // 接入 Prettier 规则
        'stylelint-config-prettier',
        'stylelint-prettier/recommended'
    ],
    // 配置 rules
    rules: {
        // 开启 Prettier 自动格式化功能
        'prettier/prettier': true
    }
}
```

然后在`package.json`增加`script`配置

```
{
  "scripts": {
    // stylelint 命令
    "lint:style": "stylelint --fix \"src/**/*.{css,scss}\""
  }
}
```

执行`pnpm run lint:style`即可对样式进行格式化

同样的我们可以在 VSCode 中安装`Stylelint`让我们在开发阶段就能看到错误

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31a31d5b0f0f42c48cda8cb58d77ccae~tplv-k3u1fbpfcp-watermark.image?)

## vite 集成 Stylelint

和 ESLint 一样,Stylelint 也可以集成在 Vite 中,让我们可以在控制台看到错误信息

vite2 安装`@amatlash/vite-plugin-stylelint`,vite3 安装 `vite-plugin-stylelint`

```
pnpm i vite-plugin-stylelint -D
```

在`vite.config.ts`中

```
import viteStylelint from 'vite-plugin-stylelint';
{
  plugins: [
    viteStylelint(),
  ]
}
```

最后在`package.json`设置一个`lint`集合命令

```
"scripts": {
        "lint:script": "eslint --ext .js,.jsx,.vue,.ts,.tsx --fix --quiet ./",
        "lint:style": "stylelint --fix \"src/**/*.{css,scss}\"",
        "lint": "npm run lint:script && npm run lint:style",
    }
```

到这里我们就已经完成了对`ESLint+Prettier+Stylelint`的配置了,接下来要做的就是让不符合规则的代码不允许`commit`,这里可以使用哈士奇(`Husky`)进行拦截

## Husky

首先安装 husky

```
pnpm i husky -D
```

script 脚本配置项目启动执行命令 husky install

```
 "scripts": {
        "prepare": "husky install"
    },
```

添加 husky 钩子生成,如果提示你`.husky`文件不存在,可以先执行下`pnpn i`或者`npx husky install`

```
npx husky add .husky/pre-commit "npm run lint"
```

执行完毕之后就会看到`.husky/pre-commit`

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint

```

### 配置 lint-staged

当我们执行`git commit`的时候就会先执行`npm run lint`,只有`lint`通过后才会提交,但是这样每次提交都要全量检查文件有点太费时,如果我们想让它只检查提交的文件可以使用`lint-staged`这个插件

```
pnpm i -D lint-staged
```

然后在`package.json`中配置

```
{
  "lint-staged": {
    "**/*.{js,jsx,tsx,ts}": [
      "npm run lint:script",
      "git add ."
    ],
    "**/*.{scss}": [
      "npm run lint:style",
      "git add ."
    ]
  }
}
```

然后将`pre-commit`中的`npm run lint`修改为`npx --no -- lint-staged`即可

### commit 提交信息规范

除了代码规范以外,代码的提交信息我们也需要进行一个规范,这里我们可以直接使用`commitlint`以及它的工具库

```
pnpm i commitlint @commitlint/cli @commitlint/config-conventional -D
```

新建`.commitlintrc.cjs`

```
module.exports = {
    extends: ["@commitlint/config-conventional"]
};
```

`@commitlint/config-conventional` 规定的 commit 信息一般由两个部分: type 和 subject 组成，结构为`<type>: <subject>`,如新增功能`feat: add fun`

type 如下

-   build 影响项目构建或依赖项修改
-   chore 其他修改
-   ci 持续集成相关文件修改
-   docs 文档修改
-   feat 添加新功能
-   fix 修复 bug
-   perf 更改代码，以提高性能
-   refactor 代码重构
-   revert 恢复上一次提交
-   style 代码格式修改
-   test 测试用例新增、修改

将`commitlint`集成到`husky`中

```
npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"
```

然后`.husky`下就多了一个`commit-msg`文件

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint -e

```
