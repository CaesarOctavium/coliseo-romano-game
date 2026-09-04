"""
Weapon system for gladiators
"""
from dataclasses import dataclass
from typing import Optional

@dataclass
class Weapon:
    """Weapon class with stats and properties"""
    
    name: str
    weapon_type: str
    damage: float
    accuracy: float  # 0.0 to 1.0
    speed: float  # attack speed multiplier
    crit_bonus: float  # critical hit bonus
    rarity: str
    level: int
    price: int
    description: str = ""
    
    def get_stats_string(self) -> str:
        """Return formatted stats string"""
        return (
            f"DMG: {self.damage:.1f} | "
            f"ACC: {self.accuracy:.0%} | "
            f"SPD: {self.speed:.1f}x | "
            f"CRIT: +{self.crit_bonus:.0%}"
        )

# Predefined weapons
WEAPONS = {
    "sword_bronze": Weapon(
        name="Espada de Bronce",
        weapon_type="sword",
        damage=8.0,
        accuracy=0.85,
        speed=1.0,
        crit_bonus=0.10,
        rarity="common",
        level=1,
        price=50,
        description="Espada de bronce balanceada"
    ),
    "sword_iron": Weapon(
        name="Espada de Hierro",
        weapon_type="sword",
        damage=12.0,
        accuracy=0.90,
        speed=0.95,
        crit_bonus=0.15,
        rarity="uncommon",
        level=10,
        price=150,
        description="Espada de hierro forjada"
    ),
    "sword_steel": Weapon(
        name="Espada de Acero",
        weapon_type="sword",
        damage=16.0,
        accuracy=0.95,
        speed=0.90,
        crit_bonus=0.20,
        rarity="rare",
        level=25,
        price=300,
        description="Espada de acero templado"
    ),
    
    "trident_wooden": Weapon(
        name="Tridente de Madera",
        weapon_type="trident",
        damage=7.0,
        accuracy=0.80,
        speed=1.1,
        crit_bonus=0.05,
        rarity="common",
        level=1,
        price=40,
        description="Tridente primitivo de madera y metal"
    ),
    "trident_iron": Weapon(
        name="Tridente de Hierro",
        weapon_type="trident",
        damage=11.0,
        accuracy=0.85,
        speed=1.05,
        crit_bonus=0.10,
        rarity="uncommon",
        level=10,
        price=140,
        description="Tridente de hierro afilado"
    ),
    "trident_legendary": Weapon(
        name="Tridente Legendario",
        weapon_type="trident",
        damage=15.0,
        accuracy=0.95,
        speed=1.0,
        crit_bonus=0.25,
        rarity="rare",
        level=25,
        price=350,
        description="Tridente de maestría con púas de metal puro"
    ),
    
    "net_basic": Weapon(
        name="Red + Daga",
        weapon_type="net",
        damage=6.0,
        accuracy=0.75,
        speed=1.2,
        crit_bonus=0.20,
        rarity="common",
        level=1,
        price=45,
        description="Red de combate con daga"
    ),
}

def get_weapon(weapon_id: str) -> Optional[Weapon]:
    """Get weapon by ID"""
    return WEAPONS.get(weapon_id)

def get_weapons_by_level(current_level: int) -> list[str]:
    """Get available weapons for current level"""
    return [
        weapon_id for weapon_id, weapon in WEAPONS.items()
        if weapon.level <= current_level
    ]
