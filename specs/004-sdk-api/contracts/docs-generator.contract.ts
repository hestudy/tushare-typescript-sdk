/**
 * 文档生成工具契约
 *
 * 定义文档生成器的输入输出格式
 */

/**
 * 文档生成器输入配置
 */
export interface DocsGeneratorInput {
  /** TypeScript 源文件路径列表 */
  sourceFiles: string[]

  /** 输出目录路径 */
  outputDir: string

  /** API 分类映射 */
  categorization: {
    [category: string]: string[]
  }

  /** 模板目录路径(可选) */
  templateDir?: string

  /** 是否生成索引页 */
  generateIndex?: boolean
}

/**
 * 生成的文档输出
 */
export interface GeneratedDocs {
  /** 生成的 API 文档页面 */
  apiPages: GeneratedPage[]

  /** 索引页面 */
  indexPage: GeneratedPage

  /** 生成统计信息 */
  stats: GenerationStats
}

/**
 * 生成的单个页面
 */
export interface GeneratedPage {
  /** 文件路径(相对于输出目录) */
  path: string

  /** Frontmatter 元数据 */
  frontmatter: {
    title: string
    category: string
    description?: string
  }

  /** Markdown 内容 */
  content: string
}

/**
 * 生成统计信息
 */
export interface GenerationStats {
  /** 处理的源文件数 */
  sourceFilesProcessed: number

  /** 生成的页面数 */
  pagesGenerated: number

  /** 提取的 API 数量 */
  apisExtracted: number

  /** 生成耗时(毫秒) */
  duration: number

  /** 错误列表 */
  errors: Array<{
    file: string
    message: string
    line?: number
  }>
}

/**
 * 文档生成器契约
 *
 * 生成器必须实现此接口
 */
export interface DocsGenerator {
  /**
   * 生成文档
   *
   * @param input - 输入配置
   * @returns 生成的文档
   */
  generate(input: DocsGeneratorInput): Promise<GeneratedDocs>

  /**
   * 验证输入配置
   *
   * @param input - 输入配置
   * @returns 验证结果
   */
  validateInput(input: DocsGeneratorInput): {
    valid: boolean
    errors: string[]
  }
}