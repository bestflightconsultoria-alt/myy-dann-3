import asyncio
import sys
from playwright.async_api import async_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("1. Navegando para a Plataforma ALCA (plataforma.alcanabica.org)...")
        await page.goto("https://plataforma.alcanabica.org/login", wait_until="networkidle")
        await asyncio.sleep(3)

        print("2. Procurando campos de login...")
        inputs = await page.locator("input").all()
        print(f"Inputs encontrados na tela de login: {len(inputs)}")

        email_field = page.locator("input[type='email'], input[placeholder*='e-mail'], input[placeholder*='Email'], input[placeholder*='CPF'], input[type='text']").first
        pass_field = page.locator("input[type='password']").first

        if await email_field.is_visible():
            await email_field.fill("lucas97.ricardo@gmail.com")
            print("E-mail preenchido.")

        if await pass_field.is_visible():
            await pass_field.fill("Org@123456")
            print("Senha preenchida. Submetendo...")
            await pass_field.press("Enter")
            await asyncio.sleep(5)

        # Salva screenshot pós login
        await page.screenshot(path=r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\alca_login_result.png")
        print("Screenshot salva!")

        # Navega para o dashboard / catálogo
        await page.goto("https://plataforma.alcanabica.org/user/dashboard", wait_until="networkidle")
        await asyncio.sleep(3)

        text = await page.evaluate("document.body.innerText")
        print("--- CONTEÚDO VISÍVEL DA ALCA ---")
        print(text[:3000])

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
