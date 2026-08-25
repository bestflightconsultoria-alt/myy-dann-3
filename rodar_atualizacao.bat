@echo off
title Atualizador de Catalogo de Strains - Google Sheets
cd /d "c:\Users\Lucas\CANNA GUIA\myy-dann2-main"
echo ========================================================
echo   Iniciando Atualizacao Automatica do Catalogo...
echo ========================================================
python atualizar_catalogo.py
echo.
echo ========================================================
echo   Processo concluido! Sua planilha no Google Sheets foi
echo   atualizada com sucesso!
echo ========================================================
pause
