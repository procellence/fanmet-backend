import { logger } from 'firebase-functions';
import * as fsExtra from 'fs-extra';
import * as Mustache from 'mustache';
import Puppeteer, { Browser, Page } from 'puppeteer';
import { Service } from 'typedi';

const PUPPETEER_OPTIONS = {
  headless: true,
  args: [
    '--start-maximized', // you can also use '--start-fullscreen'
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote',
    '--single-process',
    '--proxy-server=\'direct://\'',
    '--proxy-bypass-list=*',
    '--deterministic-fetch',
  ],
};

@Service()
export class HTMLToPDFConverter {

  public async downloadPdf(url: string, outputFilepath: string): Promise<boolean> {

    logger.log(`Downloading PDF file at ${outputFilepath} for page ${url}`);

    const { browser, page } = await this.openConnection();

    try {

      // Configure the navigation timeout
      await page.setDefaultNavigationTimeout(0);

      await page.goto(url, { waitUntil: 'networkidle0' });

      // Print the page as pdf
      const buffer = await page.pdf();

      // Export to a File
      await fsExtra.outputFile(outputFilepath, buffer);

      logger.log(`PDF generated successfully and it is available at ${outputFilepath}`);

      return true;
    } catch (e: any) {
      logger.error(`PDF generation failed, reason ${e.message}`);
      return false;
    } finally {
      await this.closeConnection(page, browser);
    }

  }

  public async generateHTMLUsingTemplate(template: string, data: object, outputFilepath: string) {
    logger.log(`Generating HTML at ${outputFilepath} using template`);
    const updatedHtmlFileData = Mustache.render(template, data);

    // Export to a File
    await fsExtra.outputFile(outputFilepath, updatedHtmlFileData);
    return outputFilepath;
  }

  private async closeConnection(page: Page, browser: Browser) {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }

  private async openConnection(): Promise<{ browser: Browser, page: Page }> {
    const browser = await Puppeteer.launch(PUPPETEER_OPTIONS);
    const page = await browser.newPage();
    await page.on('console', (obj: { text: () => any; }) => logger.log(obj.text()));
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    );
    await page.setViewport({ width: 1680, height: 1050 });
    return { browser, page };
  }

}
