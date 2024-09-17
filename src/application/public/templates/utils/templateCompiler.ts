import fs from 'fs/promises';
import Handlebars from 'handlebars';

interface TemplateContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export class TemplateCompiler {
  async compile(filePath: string, context: TemplateContext): Promise<string> {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const template = Handlebars.compile(fileContent);
    return template(context);
  }
}
