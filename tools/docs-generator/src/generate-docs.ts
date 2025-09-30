#!/usr/bin/env node
/**
 * 文档生成工具
 *
 * 从 TypeScript 源码生成 VitePress 文档
 */

import { execSync } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

const ROOT_DIR = path.resolve(__dirname, '../../..')
const DOCS_API_DIR = path.join(ROOT_DIR, 'docs/api')
const TEMP_DIR = path.join(ROOT_DIR, 'docs/api-temp')

async function main() {
  console.log('📚 开始生成 API 文档...\n')

  try {
    // 1. 运行 TypeDoc
    console.log('1️⃣ 运行 TypeDoc...')
    execSync('npx typedoc', {
      cwd: ROOT_DIR,
      stdio: 'inherit'
    })
    console.log('✅ TypeDoc 生成完成\n')

    // 2. 确保输出目录存在
    console.log('2️⃣ 准备输出目录...')
    await fs.mkdir(DOCS_API_DIR, { recursive: true })
    console.log('✅ 输出目录准备完成\n')

    // 3. 复制或转换 TypeDoc 生成的文档
    console.log('3️⃣ 处理生成的文档...')

    // 检查临时目录是否存在
    try {
      await fs.access(TEMP_DIR)

      // 复制索引文件
      const indexPath = path.join(TEMP_DIR, 'README.md')
      try {
        const indexContent = await fs.readFile(indexPath, 'utf-8')
        await fs.writeFile(
          path.join(DOCS_API_DIR, 'index.md'),
          `---\ntitle: API 参考\n---\n\n${indexContent}`
        )
        console.log('  ✓ 索引页面已生成')
      } catch (error) {
        console.log('  ⚠ 未找到索引文件,创建默认索引')
        await fs.writeFile(
          path.join(DOCS_API_DIR, 'index.md'),
          `---\ntitle: API 参考\n---\n\n# API 参考\n\n本节包含 Tushare TypeScript SDK 的完整 API 文档。\n`
        )
      }

      // 复制其他文档文件
      const files = await fs.readdir(TEMP_DIR)
      for (const file of files) {
        if (file.endsWith('.md') && file !== 'README.md') {
          const srcPath = path.join(TEMP_DIR, file)
          const destPath = path.join(DOCS_API_DIR, file)
          await fs.copyFile(srcPath, destPath)
          console.log(`  ✓ 复制文件: ${file}`)
        }
      }
    } catch (error) {
      console.log('  ⚠ TypeDoc 输出目录不存在,创建默认文档')
      await fs.writeFile(
        path.join(DOCS_API_DIR, 'index.md'),
        `---\ntitle: API 参考\n---\n\n# API 参考\n\n完整的 API 文档正在生成中...\n\n请确保源代码中包含 JSDoc 注释。\n`
      )
    }

    console.log('✅ 文档处理完成\n')

    // 4. 生成统计信息
    const apiFiles = await fs.readdir(DOCS_API_DIR)
    console.log('📊 生成统计:')
    console.log(`  - 生成的文档页面: ${apiFiles.length} 个`)
    console.log(`  - 输出目录: ${DOCS_API_DIR}`)

    console.log('\n✨ 文档生成完成!')
    console.log('💡 运行 npm run docs:dev 查看文档\n')
  } catch (error) {
    console.error('❌ 文档生成失败:', error)
    process.exit(1)
  }
}

main()