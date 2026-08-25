import asyncio
import sys
from playwright.async_api import async_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("1. Abrindo o catálogo Heyzine...")
        await page.goto("https://heyzine.com/flip-book/3d1e847d4a.html", wait_until="networkidle")
        await asyncio.sleep(4)

        print("2. Preenchendo ABSOLUTAMENTE TODOS os campos do modal...")
        inputs = await page.locator("#form-lead input").all()
        print(f"Total de inputs no #form-lead: {len(inputs)}")

        values = ["Lucas Ricardo", "lucas97.ricardo@gmail.com", "85984716334"]
        val_idx = 0

        for inp in inputs:
            t = (await inp.get_attribute("type") or "").lower()
            if t == "checkbox":
                await inp.check()
            elif t != "hidden" and t != "submit" and t != "button":
                if val_idx < len(values):
                    await inp.fill(values[val_idx])
                    val_idx += 1

        await asyncio.sleep(1)

        ok_btn = page.locator("#form-lead button, #form-lead .btn, button:has-text('Ok')").first
        if await ok_btn.is_visible():
            await ok_btn.click()
            print("Botão Ok clicado!")

        await asyncio.sleep(6)

        # Captura as 11 páginas
        print("3. Capturando imagens das páginas desbloqueadas...")
        for p_num in range(1, 12):
            await page.screenshot(path=rf"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\adaptacann_page_final_{p_num}.png")
            await page.keyboard.press("ArrowRight")
            await asyncio.sleep(2)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
