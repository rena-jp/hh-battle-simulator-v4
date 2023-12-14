export interface TrollPreBattleGlobal {
    hero_data:        HeroData;
    opponent_fighter: OpponentFighter;
}

export interface HeroData {
    id_fighter:            number;
    remaining_ego:         number;
    damage:                number;
    defense:               number;
    chance:                number;
    percent_remaining_ego: number;
    nickname:              string;
    level:                 number;
    class:                 number;
    team:                  HeroDataTeam;
    ico:                   string;
    current_season_mojo:   number;
    club:                  Club;
    stun:                  null;
    shield:                null;
    burn:                  null;
}

export interface Club {
    id_club: number;
    name:    string;
}

export interface HeroDataTeam {
    caracs:                   PurpleCaracs;
    remaining_ego:            number;
    hitter_girl_id:           number;
    id_team:                  string;
    id_member:                number;
    slot_index:               number;
    theme:                    string;
    girls_ids:                number[];
    total_power:              number;
    girls:                    PurpleGirl[];
    synergies:                Synergy[];
    theme_elements:           any[];
    power_display:            number;
    max_team_size:            number;
    min_team_size:            number;
    locked:                   boolean;
    selected_for_battle_type: string[];
}

export interface PurpleCaracs {
    ego:     number;
    damage:  number;
    defense: number;
    chance:  number;
}

export interface PurpleGirl {
    id_member:            number;
    id_girl:              number;
    shards:               number;
    level:                number;
    fav_graded:           number;
    graded:               number;
    ts_pay:               number;
    affection:            number;
    xp:                   number;
    id_places_of_power:   null;
    date_added:           string;
    awakening_level:      number;
    girl:                 FluffyGirl;
    salary:               number;
    pay_time:             number;
    pay_in:               number;
    caracs:               FluffyCaracs;
    blessed_caracs:       BlessedCaracsClass;
    caracs_sum:           number;
    battle_caracs:        BattleCaracs;
    total_battle_power:   number;
    power_display:        number;
    graded2:              string;
    favorite_grade:       number;
    salary_per_hour:      number;
    ico:                  string;
    ava:                  string;
    level_cap:            number;
    awakening_cost:       number;
    skills:               { [key: string]: SkillValue };
    skill_trait:          string;
    skill_tiers_unlocked: number[];
    skill_tiers_info:     { [key: string]: SkillTiersInfo };
}

export interface BattleCaracs {
    ego:             number;
    damage:          number;
    defense:         number;
    chance:          number;
    speed:           number;
    mana_starting:   number;
    mana_generation: number;
}

export interface BlessedCaracsClass {
    carac1: number;
    carac2: number;
    carac3: number;
}

export interface FluffyCaracs {
    carac1: number;
    carac2: number;
    carac3: number;
}

export interface FluffyGirl {
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
    blessed_caracs:      PurpleBlessedCaracs;
    grade_offsets:       GradeOffsets;
}

export interface PurpleBlessedCaracs {
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

export interface GradeOffsets {
    static:   number[];
    animated: number[];
}

export interface SkillTiersInfo {
    tier:              number;
    icon:              string;
    skill_points_used: number;
    icon_path:         string;
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
    name?:              string;
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

export interface OpponentFighter {
    player:  Player;
    rewards: Rewards;
}

export interface Player {
    id_fighter:            string;
    remaining_ego:         number;
    damage:                number;
    defense:               number;
    chance:                number;
    percent_remaining_ego: number;
    nickname:              string;
    level:                 string;
    class:                 number;
    team:                  PlayerTeam;
    ico:                   string;
    current_season_mojo:   number;
    club:                  null;
    stun:                  null;
    shield:                null;
    burn:                  null;
}

export interface PlayerTeam {
    caracs:         TentacledCaracs;
    remaining_ego:  null;
    hitter_girl_id: number;
    id_team:        null;
    id_member:      null;
    slot_index:     null;
    theme:          string;
    girls_ids:      number[];
    total_power:    number;
    girls:          TentacledGirl[];
    synergies:      Synergy[];
    theme_elements: any[];
    power_display:  number;
    max_team_size:  number;
    min_team_size:  number;
}

export interface TentacledCaracs {
    ego:     number;
    damage:  number;
    defense: number;
    chance:  number;
}

export interface TentacledGirl {
    id_member:            null;
    id_girl:              number;
    shards:               null;
    level:                string;
    fav_graded:           null;
    graded:               number;
    ts_pay:               null;
    affection:            null;
    xp:                   null;
    id_places_of_power:   null;
    date_added:           null;
    awakening_level:      number;
    girl:                 StickyGirl;
    salary:               number;
    pay_time:             number;
    pay_in:               number;
    caracs:               BlessedCaracsClass;
    blessed_caracs:       BlessedCaracsClass;
    caracs_sum:           number;
    battle_caracs:        BattleCaracs;
    total_battle_power:   number;
    power_display:        number;
    graded2:              string;
    favorite_grade:       number;
    salary_per_hour:      number;
    ico:                  string;
    ava:                  string;
    level_cap:            number;
    awakening_cost:       number;
    skills:               any[];
    skill_trait:          string;
    skill_tiers_unlocked: number[];
    skill_tiers_info:     { [key: string]: SkillTiersInfo };
}

export interface StickyGirl {
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
    animated_grades:     any[];
    anniversary:         string;
    grade_offset_values: Array<number[]>;
    element_data:        Element;
    is_released:         boolean;
    blessed_caracs:      FluffyBlessedCaracs;
    grade_offsets:       GradeOffsets;
}

export interface FluffyBlessedCaracs {
    carac1: string;
    carac2: string;
    carac3: string;
}

export interface Rewards {
    data:            Data;
    troll_item_data: null;
    item_data:       null;
    items_plain:     any[];
    girls_plain:     GirlsPlain[];
}

export interface Data {
    loot:    boolean;
    rewards: Reward[];
    shards:  Shard[];
}

export interface Reward {
    type:         string;
    value:        number | string;
    gem_type?:    string;
    gem_tooltip?: string;
}

export interface Shard {
    id_girl:         number;
    type:            string;
    slot_class:      boolean;
    rarity:          string;
    ico:             string;
    avatar:          string;
    black_avatar:    string;
    name:            string;
    girl_class:      string;
    caracs:          BlessedCaracsClass;
    graded2:         string;
    level:           number;
    element_data:    Element;
    salary_per_hour: number;
    value:           string;
    grade_offsets:   GradeOffsets;
}

export interface GirlsPlain {
    id_girl: number;
    rarity:  string;
    ico:     string;
}
