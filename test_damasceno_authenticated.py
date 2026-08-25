import asyncio
import sys
from playwright.async_api import async_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("1. Navegando para Vitrine Damasceno...")
        await page.goto("https://vitrine.sousistemas.com.br/farmaciadamasceno", wait_until="networkidle")
        await asyncio.sleep(3)

        print("2. Clicando no botão Entrar...")
        entrar_btn = page.locator("button:has-text('Entrar'), a:has-text('Entrar')").first
        if await entrar_btn.is_visible():
            await entrar_btn.click()
            await asyncio.sleep(2)

        print("3. Preenchendo formulário no modal...")
        modal = page.locator("div.fixed.inset-0")
        email_field = modal.locator("input").first
        pass_field = modal.locator("input[type='password']").first

        if await email_field.is_visible():
            await email_field.fill("lucas97.ricardo@gmail.com")
            print("E-mail preenchido.")

        if await pass_field.is_visible():
            await pass_field.fill("Org@123456")
            print("Senha preenchida. Pressionando Enter...")
            await pass_field.press("Enter")
            await asyncio.sleep(5)

        print("4. Verificando resultado pós-login...")
        await page.screenshot(path=r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\damasceno_logged_in.png")

        text = await page.evaluate("document.body.innerText")
        print("--- TEXTO PÓS LOGIN ---")
        print(text[:2500])

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
