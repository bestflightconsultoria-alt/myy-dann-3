import csv
import json
import requests
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzmQvFSwCRhc2jUlYS9oX9zTEFFQUq3bLR0LNXzRmPXvOgKoGE7oJ7KSDZ4YJ7DtKKb/exec"
CSV_PATH = r"C:\Users\Lucas\.gemini\antigravity\brain\7e314b13-60ab-4aae-9690-d9eacd03d06a\planilha_strains_brasil_completa.csv"

def enviar_para_google_sheets():
    print(f"Lendo dados de {CSV_PATH}...")
    
    rows = []
    with open(CSV_PATH, mode="r", encoding="utf-8-sig") as f:
        reader = csv.reader(f, delimiter=";")
        for row in reader:
            rows.append(row)

    print(f"Enviando {len(rows)} linhas para o Google Sheets via Web App...")
    
    # Envia via HTTP POST
    response = requests.post(WEBAPP_URL, json=rows, allow_redirects=True)
    
    if response.status_code == 200 and "OK" in response.text:
        print("🎉 SUCESSO! A planilha do Google Drive foi atualizada com sucesso!")
    else:
        print(f"Status: {response.status_code}, Resposta: {response.text}")

if __name__ == "__main__":
    enviar_para_google_sheets()
