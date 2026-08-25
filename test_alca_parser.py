import asyncio
import re
import sys
from playwright.async_api import async_playwright

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("Logando na ALCA...")
        await page.goto("https://plataforma.alcanabica.org/login", wait_until="networkidle")
        await asyncio.sleep(2)

        email_field = page.locator("input[type='email'], input[type='text']").first
        pass_field = page.locator("input[type='password']").first

        if await email_field.is_visible():
            await email_field.fill("lucas97.ricardo@gmail.com")
            await pass_field.fill("Org@123456")
            await pass_field.press("Enter")
            await asyncio.sleep(4)

        print("Navegando para catálogo...")
        await page.goto("https://plataforma.alcanabica.org/user/catalog", wait_until="networkidle")
        await asyncio.sleep(3)

        full_text = await page.evaluate("document.body.innerText")
        
        # Divide por SKU:
        blocos = full_text.split("SKU:")
        print(f"Total de blocos divididos por SKU: {len(blocos)-1}")

        itens_alca = []
        for b in blocos[1:]:
            linhas = [l.strip() for l in b.split('\n') if l.strip()]
            if not linhas:
                continue
            
            sku_code = linhas[0] # Ex: FLOR-01
            nome = linhas[1] if len(linhas) > 1 else "Desconhecido"
            
            # Encontra preço R$
            m_preco = re.search(r'R\$\s*([\d\.\,]+)', b)
            preco = m_preco.group(0) if m_preco else "N/A"

            # Encontra descrição
            desc = " ".join([l for l in linhas[2:] if "Disponível" not in l and "unidades" not in l and "Renova" not in l and "R$" not in l])

            print(f"✨ SKU: {sku_code} | Nome: {nome} | Preço: {preco}/g")
            itens_alca.append({"sku": sku_code, "nome": nome, "preco": preco, "desc": desc})

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
