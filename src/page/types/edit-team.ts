export interface EditTeamGlobal {
    teamGirls:               TeamGirlElement[];
    hero_data:               HeroData;
    availableGirls:          AvailableGirl[];
    theme_resonance_bonuses: ThemeResonanceBonuses;
    Hero:                    Hero;
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
    xp:                          number;
    id:                          number;
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

export interface AvailableGirl {
    id_member:           string;
    id_girl:             string;
    shards:              string;
    level:               string;
    fav_graded:          string;
    graded:              number;
    ts_pay:              string;
    affection:           string;
    xp:                  string;
    id_places_of_power:  null | string;
    date_added:          string;
    awakening_level:     string;
    id_girl_ref:         string;
    nb_grades:           number;
    class:               string;
    figure:              string;
    carac1:              number | string;
    carac2:              number | string;
    carac3:              number | string;
    rarity:              string;
    salaries:            string;
    id_world:            string;
    id_quest_get:        string;
    element:             string;
    name:                string;
    release_date:        string;
    anniversary:         string;
    eye_color1:          string;
    eye_color2:          string;
    hair_color1:         string;
    hair_color2:         string;
    upgrade_quests:      { [key: string]: string };
    animated_grades:     number[];
    grade_offset_values: Array<number[]>;
    zodiac:              string;
    Affection:           Affection;
    can_upgrade:         boolean;
    Graded:              string;
    graded2:             string;
    ico:                 string;
    avatar:              string;
    black_avatar:        string;
    armor:               ArmorElement[];
    caracs:              BlessedCaracsClass;
    skill_tiers_info:    { [key: string]: SkillTiersInfo };
    grade_offsets:       number[];
    blessed_attributes?: string[];
    caracs_sum:          number;
    orgasm:              number;
    style:               string;
    element_data:        Element;
    position_img:        string;
    level_cap:           number;
    salary:              number;
    pay_time:            number;
    pay_in:              number;
    salary_per_hour:     number;
    Xp:                  Affection;
}

export interface Affection {
    cur:   number;
    min:   number;
    max:   number;
    level: number;
    left:  number;
    ratio: number;
    maxed: boolean;
}

export interface ArmorElement {
    id_girl_armor_equipped: string;
    id_member:              string;
    id_girl_item_armor:     string;
    id_item_skin:           string;
    id_variation:           string;
    level:                  string;
    id_girl:                number | string;
    caracs:                 ArmorCaracs;
    slot_index:             number;
    armor:                  ArmorArmor;
    skin:                   Skin;
    variation:              Variation | null;
    rarity:                 string;
    type:                   string;
    resonance_bonuses:      any[] | ResonanceBonusesClass;
}

export interface ArmorArmor {
    id_girl_item_armor: string;
    rarity:             string;
    carac1:             string;
    carac2:             string;
    carac3:             string;
    damage:             string;
    defense:            string;
    ego:                string;
}

export interface ArmorCaracs {
    carac1:  number;
    carac2:  number;
    carac3:  number;
    damage:  number;
    defense: number;
    ego:     number;
}

export interface ResonanceBonusesClass {
    class:    Class;
    element?: Class;
    figure?:  Class;
}

export interface Class {
    identifier: string;
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

export interface Variation {
    id_variation:      string;
    rarity:            string;
    class:             string;
    class_resonance:   string;
    element:           null | string;
    element_resonance: null | string;
    figure:            null | string;
    figure_resonance:  null | string;
}

export interface BlessedCaracsClass {
    carac1: number;
    carac2: number;
    carac3: number;
}

export interface Element {
    type:                                     string;
    weakness:                                 string;
    domination:                               string;
    domination_ego_bonus_percent:             number;
    domination_damage_bonus_percent:          number;
    domination_critical_chance_bonus_percent: number;
    ico_url:                                  string;
    flavor:                                   string;
}

export interface SkillTiersInfo {
    tier:              number;
    icon:              string;
    skill_points_used: number;
    icon_path:         string;
}

export interface HeroData {
    chance:        number;
    class:         number;
    damage:        number;
    defense:       number;
    ico:           string;
    level:         number;
    nickname:      string;
    remaining_ego: number;
    team:          Team;
}

export interface Team {
    id_team:                  string;
    id_member:                number;
    slot_index:               string;
    theme:                    string;
    girls_ids:                string[];
    total_power:              number;
    caracs:                   TeamCaracs;
    girls:                    TeamGirlElement[];
    synergies:                Synergy[];
    theme_elements:           any[];
    remaining_ego:            number;
    power_display:            number;
    hitter_girl_id:           number;
    max_team_size:            number;
    min_team_size:            number;
    locked:                   boolean;
    selected_for_battle_type: any[];
}

export interface TeamCaracs {
    ego:     number;
    damage:  number;
    defense: number;
    chance:  number;
}

export interface TeamGirlElement {
    id_member:            string;
    id_girl:              string;
    shards:               string;
    level:                string;
    fav_graded:           string;
    graded:               string;
    ts_pay:               string;
    affection:            string;
    xp:                   string;
    id_places_of_power:   null | string;
    date_added:           string;
    awakening_level:      string;
    girl:                 TeamGirlGirl;
    salary:               number;
    pay_time:             number;
    pay_in:               number;
    caracs:               BlessedCaracsClass;
    blessed_caracs:       BlessedCaracsClass;
    caracs_sum:           number;
    graded2:              string;
    favorite_grade:       number;
    salary_per_hour:      number;
    ico:                  string;
    ava:                  string;
    level_cap:            number;
    awakening_cost:       number;
    skills:               any[] | { [key: string]: SkillValue };
    skill_trait:          string;
    skill_tiers_unlocked: number[];
    skill_tiers_info:     { [key: string]: SkillTiersInfo };
}

export interface TeamGirlGirl {
    id_girl:             number;
    id_girl_ref:         string;
    nb_grades:           number;
    class:               string;
    figure:              string;
    carac1:              string;
    carac2:              string;
    carac3:              string;
    rarity:              string;
    salaries:            string;
    id_world:            string;
    id_quest_get:        string;
    name:                string;
    release_date:        string;
    upgrade_quests:      { [key: string]: string };
    hair_color1:         string;
    hair_color2:         string;
    eye_color1:          string;
    eye_color2:          string;
    zodiac:              string;
    element:             string;
    animated_grades:     number[];
    anniversary:         string;
    grade_offset_values: Array<number[]>;
    element_data:        Element;
    is_released:         boolean;
    blessed_caracs:      BlessedCaracs;
    grade_offsets:       number[];
}

export interface BlessedCaracs {
    carac1: number | string;
    carac2: number | string;
    carac3: number | string;
}

export interface SkillValue {
    id_member: string;
    id_girl:   string;
    id_skill:  string;
    level:     string;
    tier:      number;
    skill:     SkillSkill;
}

export interface SkillSkill {
    level:              number;
    class:              string;
    element:            string;
    rarity:             string;
    id_skill:           number;
    tier:               number;
    flat_value:         number | null;
    percentage_value:   number | null;
    display_value_text: string;
    description:        string;
    icon:               string;
    skill_type?:        string;
    named_attack_text?: string;
    is_used_in_battle?: boolean;
}

export interface Synergy {
    element:                Element;
    team_girls_count:       number;
    harem_girls_count:      number;
    bonus_identifier:       string;
    team_bonus_per_girl:    number;
    harem_bonus_per_girl:   number;
    team_bonus_max_amount:  number;
    harem_bonus_max_amount: number;
    bonus_multiplier:       number;
    team_bonus_multiplier:  number;
    harem_bonus_multiplier: number;
}

export interface ThemeResonanceBonuses {
    nature: Empty;
    "":     Empty;
    stone:  Empty;
}

export interface Empty {
    defense: number;
}
