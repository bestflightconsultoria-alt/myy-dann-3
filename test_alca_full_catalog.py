import asyncio
import sys
from playwright.async_api import async_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("1. Logando na ALCA...")
        await page.goto("https://plataforma.alcanabica.org/login", wait_until="networkidle")
        await asyncio.sleep(2)

        email_field = page.locator("input[type='email'], input[type='text']").first
        pass_field = page.locator("input[type='password']").first

        if await email_field.is_visible() and await pass_field.is_visible():
            await email_field.fill("lucas97.ricardo@gmail.com")
            await pass_field.fill("Org@123456")
            await pass_field.press("Enter")
            await asyncio.sleep(4)

        print("2. Navegando para o Catálogo da ALCA...")
        await page.goto("https://plataforma.alcanabica.org/user/catalog", wait_until="networkidle")
        await asyncio.sleep(3)

        # Rolar página para carregar todos os itens do catálogo
        for _ in range(6):
            await page.evaluate("window.scrollBy(0, 800)")
            await asyncio.sleep(1)

        await page.screenshot(path=r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\alca_catalog.png")
        print("Screenshot do Catálogo salva!")

        text = await page.evaluate("document.body.innerText")
        print("--- CONTEÚDO DO CATÁLOGO ALCA ---")
        print(text[:4000])

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
