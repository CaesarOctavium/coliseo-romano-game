"""
Armor system for gladiators
Includes helmets, chest pieces, leg protection, knee guards, and boots
"""
from dataclasses import dataclass
from typing import Optional
from game.constants import *

@dataclass
class ArmorPiece:
    """Individual armor piece"""
    
    name: str
    armor_type: str  # helmet, chest, legs, knees, boots
    quality: str
    defense: float  # damage reduction percentage
    agility_penalty: float  # negative percentage
    rarity: str
    level: int
    price: int
    description: str = ""
    
    def get_stats_string(self) -> str:
        """Return formatted stats string"""
        stats = f"DEF: +{self.defense:.0%}"
        if self.agility_penalty < 0:
            stats += f" | AGI: {self.agility_penalty:.0%}"
        return stats

# HELMETS
HELMETS = {
    "helmet_leather": ArmorPiece(
        name="Casco de Cuero",
        armor_type=ARMOR_HELMET,
        quality=ARMOR_QUALITY_PRIMITIVE,
        defense=0.10,
        agility_penalty=-0.05,
        rarity=RARITY_COMMON,
        level=1,
        price=30,
        description="Casco primitivo de cuero"
    ),
    "helmet_iron": ArmorPiece(
        name="Casco de Hierro",
        armor_type=ARMOR_HELMET,
        quality=ARMOR_QUALITY_METAL,
        defense=0.20,
        agility_penalty=-0.08,
        rarity=RARITY_UNCOMMON,
        level=10,
        price=80,
        description="Casco de hierro forjado"
    ),
    "helmet_warrior": ArmorPiece(
        name="Casco de Guerrero",
        armor_type=ARMOR_HELMET,
        quality=ARMOR_QUALITY_METAL,
        defense=0.30,
        agility_penalty=-0.10,
        rarity=RARITY_RARE,
        level=25,
        price=150,
        description="Casco de guerrero experimentado"
    ),
}

# CHEST PIECES
CHEST_PIECES = {
    "chest_tunic": ArmorPiece(
        name="Túnica Reforzada",
        armor_type=ARMOR_CHEST,
        quality=ARMOR_QUALITY_PRIMITIVE,
        defense=0.05,
        agility_penalty=0.0,
        rarity=RARITY_COMMON,
        level=1,
        price=25,
        description="Túnica romana reforzada"
    ),
    "chest_lorica_leather": ArmorPiece(
        name="Lorica de Cuero",
        armor_type=ARMOR_CHEST,
        quality=ARMOR_QUALITY_LEATHER,
        defense=0.15,
        agility_penalty=-0.03,
        rarity=RARITY_UNCOMMON,
        level=10,
        price=70,
        description="Lorica segmentada de cuero"
    ),
    "chest_lorica_segmentata": ArmorPiece(
        name="Lorica Segmentada",
        armor_type=ARMOR_CHEST,
        quality=ARMOR_QUALITY_METAL,
        defense=0.25,
        agility_penalty=-0.05,
        rarity=RARITY_RARE,
        level=25,
        price=140,
        description="Lorica segmentada de metal puro"
    ),
}

# LEG PROTECTION (GREBAS)
LEG_PIECES = {
    "legs_wraps": ArmorPiece(
        name="Vendajes",
        armor_type=ARMOR_LEGS,
        quality=ARMOR_QUALITY_PRIMITIVE,
        defense=0.02,
        agility_penalty=0.0,
        rarity=RARITY_COMMON,
        level=1,
        price=15,
        description="Vendajes de protección básica"
    ),
    "legs_leather": ArmorPiece(
        name="Grebas de Cuero",
        armor_type=ARMOR_LEGS,
        quality=ARMOR_QUALITY_LEATHER,
        defense=0.10,
        agility_penalty=-0.02,
        rarity=RARITY_UNCOMMON,
        level=10,
        price=60,
        description="Grebas de cuero reforzado"
    ),
    "legs_metal": ArmorPiece(
        name="Grebas de Metal",
        armor_type=ARMOR_LEGS,
        quality=ARMOR_QUALITY_METAL,
        defense=0.18,
        agility_penalty=-0.05,
        rarity=RARITY_RARE,
        level=25,
        price=120,
        description="Grebas de metal pulido"
    ),
}

# KNEE GUARDS
KNEE_PIECES = {
    "knees_primitive": ArmorPiece(
        name="Rodilleras Primitivas",
        armor_type=ARMOR_KNEES,
        quality=ARMOR_QUALITY_PRIMITIVE,
        defense=0.03,
        agility_penalty=0.0,
        rarity=RARITY_COMMON,
        level=1,
        price=20,
        description="Rodilleras de protección básica"
    ),
    "knees_leather": ArmorPiece(
        name="Rodilleras de Cuero",
        armor_type=ARMOR_KNEES,
        quality=ARMOR_QUALITY_LEATHER,
        defense=0.08,
        agility_penalty=-0.01,
        rarity=RARITY_UNCOMMON,
        level=10,
        price=50,
        description="Rodilleras reforzadas de cuero"
    ),
    "knees_metal": ArmorPiece(
        name="Rodilleras de Metal",
        armor_type=ARMOR_KNEES,
        quality=ARMOR_QUALITY_METAL,
        defense=0.15,
        agility_penalty=-0.04,
        rarity=RARITY_RARE,
        level=25,
        price=100,
        description="Rodilleras blindadas"
    ),
}

# BOOTS
BOOT_PIECES = {
    "boots_sandal": ArmorPiece(
        name="Sandalia Reforzada",
        armor_type=ARMOR_BOOTS,
        quality=ARMOR_QUALITY_PRIMITIVE,
        defense=0.03,
        agility_penalty=0.02,
        rarity=RARITY_COMMON,
        level=1,
        price=20,
        description="Sandalia romana reforzada"
    ),
    "boots_leather": ArmorPiece(
        name="Bota de Cuero",
        armor_type=ARMOR_BOOTS,
        quality=ARMOR_QUALITY_LEATHER,
        defense=0.08,
        agility_penalty=0.01,
        rarity=RARITY_UNCOMMON,
        level=10,
        price=55,
        description="Bota de cuero moldeada"
    ),
    "boots_military": ArmorPiece(
        name="Bota Militar",
        armor_type=ARMOR_BOOTS,
        quality=ARMOR_QUALITY_METAL,
        defense=0.12,
        agility_penalty=-0.01,
        rarity=RARITY_RARE,
        level=25,
        price=110,
        description="Bota militar de hierro reforzado"
    ),
}

# All armor pieces
ALL_ARMOR = {
    **HELMETS,
    **CHEST_PIECES,
    **LEG_PIECES,
    **KNEE_PIECES,
    **BOOT_PIECES,
}

def get_armor(armor_id: str) -> Optional[ArmorPiece]:
    """Get armor piece by ID"""
    return ALL_ARMOR.get(armor_id)

def get_armor_by_type(armor_type: str, current_level: int) -> list[str]:
    """Get available armor pieces of a type for current level"""
    pieces = []
    for armor_id, piece in ALL_ARMOR.items():
        if piece.armor_type == armor_type and piece.level <= current_level:
            pieces.append(armor_id)
    return pieces

def get_all_armor_by_level(current_level: int) -> dict[str, list[str]]:
    """Get all available armor by type and level"""
    return {
        ARMOR_HELMET: get_armor_by_type(ARMOR_HELMET, current_level),
        ARMOR_CHEST: get_armor_by_type(ARMOR_CHEST, current_level),
        ARMOR_LEGS: get_armor_by_type(ARMOR_LEGS, current_level),
        ARMOR_KNEES: get_armor_by_type(ARMOR_KNEES, current_level),
        ARMOR_BOOTS: get_armor_by_type(ARMOR_BOOTS, current_level),
    }
