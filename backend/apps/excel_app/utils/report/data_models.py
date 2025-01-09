from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class Documentation:
    """
    Класс для представления документации.

    Атрибуты:
        name (str): Название документации.
        year (int): Год выпуска.
        developer (str): Разработчик документации.
    """

    name: str
    year: int
    developer: str

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Documentation':
        """
        Создает объект Documentation из словаря.

        Аргументы:
            data (Dict[str, Any]): Словарь с данными.

        Возвращает:
            Documentation: Объект документации.
        """
        return cls(
            name=data.get('name'),
            year=data.get('year'),
            developer=data.get('developer')
        )

    def __str__(self) -> str:
        """
        Возвращает строковое представление объекта Documentation.

        Возвращает:
            str: Строковое представление.
        """
        return f'Name: {self.name}, Year: {self.year}, Developer: {self.developer}'


@dataclass
class Section:
    """
    Класс для представления секции.

    Атрибуты:
        sectionId (int): Идентификатор секции.
        sectionName (str): Название секции.
        sheetId (int): Идентификатор листа.
    """

    sectionId: int
    sectionName: str
    sheetId: int

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Section':
        """
        Создает объект Section из словаря.

        Аргументы:
            data (Dict[str, Any]): Словарь с данными.

        Возвращает:
            Section: Объект секции.
        """
        return cls(
            sectionId=data.get('sectionId'),
            sectionName=data.get('sectionName'),
            sheetId=data.get('sheetId')
        )

    def __str__(self) -> str:
        """
        Возвращает строковое представление объекта Section.

        Возвращает:
            str: Строковое представление.
        """
        return f'Section ID: {self.sectionId}, Section Name: {self.sectionName}, Sheet ID: {self.sheetId}'


@dataclass
class UniversalObject:
    """
    Класс для представления универсального объекта.

    Атрибуты:
        kwargs (Any): Произвольные аргументы ключ-значение.
    """

    def __init__(self, **kwargs: Any):
        """
        Инициализирует объект UniversalObject.

        Аргументы:
            kwargs (Any): Произвольные аргументы ключ-значение.
        """
        for key, value in kwargs.items():
            setattr(self, key, value)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'UniversalObject':
        """
        Создает объект UniversalObject из словаря.

        Аргументы:
            data (Dict[str, Any]): Словарь с данными.

        Возвращает:
            UniversalObject: Объект универсального объекта.
        """
        return cls(**data)

    def __str__(self) -> str:
        """
        Возвращает строковое представление объекта UniversalObject.

        Возвращает:
            str: Строковое представление.
        """
        return ', '.join(
            f'{key}: {value}' for key, value in self.__dict__.items())
