import asyncio
import sys
from playwright.async_api import async_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("1. Abrindo o catálogo Heyzine da Adapta-Cann...")
        await page.goto("https://heyzine.com/flip-book/3d1e847d4a.html", wait_until="networkidle")
        await asyncio.sleep(3)

        print("2. Preenchendo o formulário de entrada do Heyzine...")
        name_field = page.locator("input[placeholder*='Name'], input[placeholder*='Nome'], input[name='name']").first
        email_field = page.locator("input[placeholder*='Email'], input[name='email']").first
        phone_field = page.locator("input[placeholder*='Whatsapp'], input[placeholder*='Telefone']").first
        chk_box = page.locator("input[type='checkbox']").first
        ok_btn = page.locator("button:has-text('Ok'), input[type='submit'], div:has-text('Ok')").last

        if await name_field.is_visible():
            await name_field.fill("Lucas Ricardo")
        if await email_field.is_visible():
            await email_field.fill("lucas97.ricardo@gmail.com")
        if await phone_field.is_visible():
            await phone_field.fill("85984716334")
        if await chk_box.is_visible():
            await chk_box.check()
        
        # Pressiona Enter ou clica no OK
        await page.keyboard.press("Enter")
        await asyncio.sleep(4)

        print("3. Capturando imagens e textos das 11 páginas...")
        for p_num in range(1, 12):
            await page.screenshot(path=rf"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\adaptacann_page_{p_num}.png")
            await page.keyboard.press("ArrowRight")
            await asyncio.sleep(1.5)

        # Extrai todo o texto renderizado
        full_text = await page.evaluate("document.body.innerText")
        print("--- CONTEÚDO EXTRAÍDO PÓS LIBERAÇÃO ---")
        print(full_text[:4000])

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
