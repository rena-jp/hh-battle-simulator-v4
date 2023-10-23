export interface ShopGlobal {
    player_inventory: PlayerInventory;
    market_inventory: MarketInventory;
    equipped_armor:   { [key: string]: EquippedArmor };
    equipped_booster: EquippedBooster;
    heroStatsPrices:  { [key: string]: HeroStatsPrice };
    Hero:             Hero;
}

export interface Hero {
    infos:         Infos;
    energies:      Energies;
    energy_fields: { [key: string]: EnergyField };
    no_glitter:    boolean;
    caracs:        string[];
    club:          Club;
    currencies:    { [key: string]: number };
    mc_level:      string;
}

export interface Club {
    id_club:                   string;
    name:                      string;
    status:                    string;
    level_restriction:         string;
    ico:                       string;
    max_members:               string;
    created_by:                string;
    created_at:                string;
    place:                     string;
    upgrades_data:             UpgradesData;
    total_contribution_points: string;
    total_upgrades:            string;
    member_count:              string;
    level:                     string;
    leader_id:                 string;
    leader_name:               string;
    co_leaders:                any[];
    is_leader:                 boolean;
    is_co_leader:              boolean;
    chat_token:                string;
}

export interface UpgradesData {
    member_cap:         CharmStats;
    hardcore_stats:     CharmStats;
    charm_stats:        CharmStats;
    know_how_stats:     CharmStats;
    endurance_stats:    CharmStats;
    harmony_stats:      CharmStats;
    experience_gain:    CharmStats;
    soft_currency_gain: CharmStats;
}

export interface CharmStats {
    level:        number;
    contribution: number;
}

export interface Energies {
    quest:     Challenge;
    fight:     Challenge;
    challenge: Challenge;
    kiss:      Challenge;
    worship:   Challenge;
    reply:     Challenge;
}

export interface Challenge {
    amount:            number;
    max_regen_amount:  number;
    max_amount:        number;
    update_ts:         number;
    seconds_per_point: number;
    next_refresh_ts:   number;
    recharge_time:     number;
}

export interface EnergyField {
    type:  string;
    field: string;
}

export interface Infos {
    id:                          number;
    xp:                          number;
    carac1:                      number;
    carac2:                      number;
    carac3:                      number;
    is_tester:                   number;
    is_cheater:                  number;
    level:                       number;
    class:                       number;
    name:                        string;
    questing:                    Questing;
    harem_endurance:             number;
    caracs:                      InfosCaracs;
    Xp:                          XP;
    screen_ratio:                number;
    nosound:                     boolean;
    no_pachinko_anim:            boolean;
    no_static_image_animation:   boolean;
    hc_confirm:                  boolean;
    hh_universe:                 string;
    on_prod_server:              boolean;
    market_stats_purchase_steps: number[];
    club_cooldown_ts:            number;
    server_time:                 string;
}

export interface XP {
    cur:      number;
    min:      number;
    max:      number;
    level:    number;
    next_max: number;
    left:     number;
    ratio:    number;
}

export interface InfosCaracs {
    carac1:               number;
    carac2:               number;
    carac3:               number;
    endurance:            number;
    chance:               number;
    primary_carac_amount: number;
    secondary_caracs_sum: number;
}

export interface Questing {
    id_world:    string;
    step:        number;
    id_quest:    number;
    num_step:    number;
    current_url: string;
}

export interface EquippedArmor {
    id_member_armor_equipped: string;
    id_member:                string;
    id_variation:             string;
    id_item_skin:             string;
    level:                    string;
    skin:                     Skin;
    item:                     EquippedArmorItem;
    name:                     string;
    price_buy:                number;
    price_sell:               number;
    carac1_equip:             number;
    carac2_equip:             number;
    carac3_equip:             number;
    chance_equip:             number;
    endurance_equip:          number;
    resonance_bonuses:        EquippedArmorResonanceBonuses;
    caracs:                   EquippedArmorCaracs;
}

export interface EquippedArmorCaracs {
    carac1:    number;
    carac2:    number;
    carac3:    number;
    endurance: number;
    chance:    number;
}

export interface EquippedArmorItem {
    id_item_equip: null;
    id_equip:      null;
    rarity:        string;
    carac1:        null;
    carac2:        null;
    carac3:        null;
    endurance:     null;
    chance:        null;
    ego:           null;
    damage:        null;
    name_add:      null;
    weight:        null;
    currency:      string;
    type:          string;
}

export interface EquippedArmorResonanceBonuses {
    class: PurpleClass;
    theme: PurpleTheme;
}

export interface PurpleClass {
    identifier: string;
    resonance:  string;
    bonus:      number;
}

export interface PurpleTheme {
    identifier: null | string;
    resonance:  string;
    bonus:      number;
}

export interface Skin {
    release_date: string;
    id_item_skin: string;
    id_skin_set:  string;
    identifier:   string;
    subtype:      string;
    wearer:       string;
    weight:       string;
    name:         string;
    ico:          string;
}

export interface EquippedBooster {
    normal: Normal[];
    mythic: Mythic[];
}

export interface Mythic {
    id_member_booster_equipped: string;
    id_member:                  string;
    id_item:                    string;
    lifetime:                   string;
    usages_remaining:           string;
    item:                       MythicItem;
    expiration:                 number;
    price_sell:                 number;
}

export interface MythicItem {
    id_item:        string;
    type:           string;
    identifier:     string;
    rarity:         string;
    price:          string;
    currency:       string;
    value:          string;
    carac1:         string;
    carac2:         string;
    carac3:         string;
    endurance:      string;
    chance:         string;
    ego:            string;
    damage:         string;
    duration:       string;
    skin:           string;
    name:           string;
    ico:            string;
    display_price:  number;
    default_usages: number;
}

export interface Normal {
    id_member_booster_equipped: string;
    id_member:                  string;
    id_item:                    string;
    lifetime:                   string;
    usages_remaining:           string;
    item:                       NormalItem;
    expiration:                 number;
    price_sell:                 number;
}

export interface NormalItem {
    id_item:       string;
    type:          string;
    identifier:    string;
    rarity:        string;
    price:         string;
    currency:      string;
    value:         string;
    carac1:        string;
    carac2:        string;
    carac3:        string;
    endurance:     string;
    chance:        string;
    ego:           string;
    damage:        string;
    duration:      string;
    skin:          string;
    name:          string;
    ico:           string;
    display_price: number;
}

export interface HeroStatsPrice {
    prices:    Prices;
    base_stat: number;
    max:       number;
}

export interface Prices {
    x1:  string;
    x10: string;
    x30: string;
    x60: string;
}

export interface MarketInventory {
    armor:   MarketInventoryArmor[];
    booster: MarketInventoryBooster[];
    potion:  PotionElement[];
    gift:    PotionElement[];
}

export interface MarketInventoryArmor {
    id_member_armor: null;
    id_member:       string;
    id_item_equip:   string;
    id_item_skin:    string;
    level:           number;
    carac1_equip:    number;
    carac2_equip:    number;
    carac3_equip:    number;
    endurance_equip: number;
    chance_equip:    number;
    ego_equip:       number;
    name:            string;
    item:            PurpleItem;
    skin:            Skin;
    price_buy:       number;
    price_sell:      number;
    caracs:          PurpleCaracs;
    index:           number;
}

export interface PurpleCaracs {
    carac1:    number;
    carac2:    number;
    carac3:    number;
    endurance: number;
    chance:    number;
    ego:       number;
}

export interface PurpleItem {
    id_item_equip: string;
    id_equip:      string;
    rarity:        string;
    carac1:        number;
    carac2:        number;
    carac3:        number;
    endurance:     number;
    chance:        number;
    ego:           number;
    damage:        number;
    name_add:      string;
    weight:        string;
    currency:      string;
    type:          string;
}

export interface MarketInventoryBooster {
    id_member:  null;
    id_item:    number;
    quantity:   null;
    item:       BoosterItem;
    price_buy:  number;
    price_sell: number;
    index:      number;
}

export interface BoosterItem {
    id_item:         string;
    type:            string;
    identifier:      string;
    rarity:          string;
    price:           string;
    currency:        string;
    value:           string;
    carac1:          string;
    carac2:          string;
    carac3:          string;
    endurance:       string;
    chance:          string;
    ego:             string;
    damage:          string;
    duration:        string;
    skin:            string;
    name:            string;
    ico:             string;
    display_price:   number;
    default_usages?: number;
}

export interface PotionElement {
    id_member:  null;
    id_item:    number;
    quantity:   null;
    item:       NormalItem;
    price_buy:  number;
    price_sell: number;
    index:      number;
}

export interface PlayerInventory {
    armor:   PlayerInventoryArmor[];
    booster: PlayerInventoryBooster[];
    potion:  Potion[];
    gift:    PlayerInventoryGift[];
}

export interface PlayerInventoryArmor {
    id_member_armor:    string;
    id_member:          string;
    id_variation?:      string;
    id_item_skin:       string;
    level:              string;
    skin:               Skin;
    item:               FluffyItem;
    name:               string;
    price_buy:          number;
    price_sell:         number;
    carac1_equip:       number | string;
    carac2_equip:       number | string;
    carac3_equip:       number | string;
    chance_equip:       number | string;
    endurance_equip:    number | string;
    resonance_bonuses?: ArmorResonanceBonuses;
    caracs:             FluffyCaracs;
    id_item_equip?:     string;
    ego_equip?:         string;
}

export interface FluffyCaracs {
    carac1:    number | string;
    carac2:    number | string;
    carac3:    number | string;
    endurance: number | string;
    chance:    number | string;
    ego?:      string;
}

export interface FluffyItem {
    id_item_equip: null | string;
    id_equip:      null | string;
    rarity:        string;
    carac1:        number | null;
    carac2:        number | null;
    carac3:        number | null;
    endurance:     number | null;
    chance:        number | null;
    ego:           number | null;
    damage:        number | null;
    name_add:      null | string;
    weight:        null | string;
    currency:      string;
    type:          string;
}

export interface ArmorResonanceBonuses {
    class: FluffyClass;
    theme: FluffyTheme;
}

export interface FluffyClass {
    identifier: string;
    resonance:  string;
    bonus:      number;
}

export interface FluffyTheme {
    identifier: null | string;
    resonance:  string;
    bonus:      number;
}

export interface PlayerInventoryBooster {
    id_member:  string;
    id_item:    string;
    quantity:   string;
    item:       BoosterItem;
    price_buy:  number;
    price_sell: number;
}

export interface PlayerInventoryGift {
    id_member:  string;
    id_item:    string;
    quantity:   string;
    item:       NormalItem;
    price_buy:  number;
    price_sell: number;
}

export interface Potion {
    id_member:  string;
    id_item:    string;
    quantity:   number | string;
    item:       NormalItem;
    price_buy:  number;
    price_sell: number;
}
