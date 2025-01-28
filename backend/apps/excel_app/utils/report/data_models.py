from dataclasses import dataclass
from typing import Dict, Any, List


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
class Defect:
    """
    Класс для представления дефектов.

    Атрибуты:
        type (str): Тип дефектов.
        defects (List[str]): Выявленные дефекты и повреждения.
        recs (List[str]): Рекомендации по устранению.
        phys_value (int): Физический износ.
        cat (str): Категория технического состояния.
    """

    type: str
    defects: List[str]
    recs: List[str]
    physValue: int
    cat: str

    @classmethod
    def from_dict(cls, type: str, data: Dict[str, Any]) -> 'Defect':
        """
        Создает объект Defect из словаря.

        Аргументы:
            type (str): Тип дефектов.
            data (Dict[str, Any]): Словарь с данными.

        Возвращает:
            Defect: Объект дефектов.
        """
        return cls(
            type=type,
            defects=data.get('defects', []),
            recs=data.get('recs', []),
            physValue=data.get('physValue', 0),
            cat=data.get('cat', '')
        )

    def __str__(self) -> str:
        """
        Возвращает строковое представление объекта Defect.

        Возвращает:
            str: Строковое представление.
        """
        return f'Тип: {self.type}, Дефекты: {self.defects}, Рекомендации: {self.recs}, Физический износ: {self.phys_value}, Категория: {self.cat}'

    def __hash__(self):
        """
        Returns the hash value of the Defect object.

        Returns:
            int: Hash value.
        """
        return hash((self.type, tuple(self.defects), tuple(self.recs), self.physValue, self.cat))

    def __eq__(self, other):
        """
        Checks if two Defect objects are equal.

        Args:
            other (Defect): Another Defect object.

        Returns:
            bool: True if equal, False otherwise.
        """
        if not isinstance(other, Defect):
            return False
        return (self.type, self.defects, self.recs, self.physValue, self.cat) == (other.type, other.defects, other.recs, other.physValue, other.cat)

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
