import flet as ft
import asyncio
from .Components.mainPage.mainPage import MainPage


async def main(page:ft.Page):
    page.title = "連動実績入力"
    page.add(MainPage)


if __name__ == "__main__":
    ft.app(traget=main)


