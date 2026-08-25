import asyncio
import sys
from playwright.async_api import async_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("Navegando para https://vitrine.sousistemas.com.br/farmaciadamasceno...")
        await page.goto("https://vitrine.sousistemas.com.br/farmaciadamasceno", wait_until="networkidle")
        await asyncio.sleep(5)
        
        # Tirar screenshot para diagnóstico
        await page.screenshot(path=r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\vitrine_screenshot.png")
        print("Screenshot salva!")

        # Imprimir o texto visível da página
        text = await page.evaluate("document.body.innerText")
        print("--- TEXTO VISÍVEL DA PÁGINA ---")
        print(text[:2000])

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
