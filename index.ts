import puppeteer from "puppeteer"
import fs from "node:fs/promises"

let browser = await puppeteer.launch({headless: true})
let page = await browser.newPage()

async function tryGetPrerenderedHTML(filename: string) {
	let url = Bun.pathToFileURL(filename)
	await page.goto(url.toString())
	console.log("Scrolling to bottom")
	await page.evaluate(`window.scrollTo(0, document.body.scrollHeight)`)
	console.log("Waiting for mathjax to render")
	await page.waitForFunction("document.body.attributes['data-mathjax-rendered']?.value == 'true'", {timeout: 15000})
	console.log("Removing scripts")
	await page.evaluate(`
		let scripts = [...document.querySelectorAll("script")];
		scripts.forEach((el) => el.parentElement.removeChild(el))
	`)
	let html = await page.content()
	return html
}

async function getPrerenderedHTML(filename: string) {
	while (true) {
		try {
			return await tryGetPrerenderedHTML(filename)
		}
		catch (e) {
			console.error(`Failed due to ${e}, retrying`)
			await browser.close()
			browser = await puppeteer.launch({headless: true})
			page = await browser.newPage()
		}
	}
}

async function main() {
	await fs.rm("dist", {recursive: true, force: true})
	await fs.cp("book", "dist", {recursive: true})
	let files = await fs.readdir("dist", {recursive: true})
	for (let file of files) {
		if (file.endsWith(".xhtml")) {
			console.log(`Rendering ${file}`)
			// let contents = (await Bun.file(`dist/${file}`).text()).replaceAll("output/SVG", "output/CommonHTML")
			// await Bun.write(`dist/${file}`, contents)
			let contents = (await Bun.file(`dist/${file}`).text()).replaceAll("scale: 85", "scale: 100, useGlobalCache: false")
			await Bun.write(`dist/${file}`, contents)
			let rendered = await getPrerenderedHTML(`dist/${file}`)
			await fs.writeFile(`dist/${file}`, rendered)
		}
		else if (file.endsWith(".js")) {
			await fs.rm(`dist/${file}`)
		}
	}

}

await main()
await browser.close()
