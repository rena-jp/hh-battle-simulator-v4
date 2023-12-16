export interface TeamsGlobal {
    teams_data: { [key: string]: TeamsDatum };
}

export interface TeamsDatum {
    caracs:                   TeamsDatumCaracs;
    remaining_ego:            number;
    hitter_girl_id:           number;
    id_team:                  number | null | string;
    id_member:                number;
    slot_index:               number;
    theme:                    null | string;
    girls_ids:                number[];
    total_power:              number;
    girls:                    GirlElement[];
    synergies:                Synergy[];
    theme_elements:           ThemeElement[];
    power_display:            number;
    max_team_size:            number;
    min_team_size:            number;
    locked:                   boolean;
    selected_for_battle_type: string[];
}

export interface TeamsDatumCaracs {
    ego:     number;
    damage:  number;
    defense: number;
    chance:  number;
}

export interface GirlElement {
    id_member:            number;
    id_girl:              number;
    shards:               number;
    level:                number;
    fav_graded:           number;
    graded:               number;
    ts_pay:               number;
    affection:            number;
    xp:                   number;
    id_places_of_power:   number | null;
    date_added:           string;
    awakening_level:      number;
    girl:                 GirlGirl;
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
    skills:               any[] | { [key: string]: SkillValue };
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

export interface GirlGirl {
    id_girl:             number;
    id_girl_ref:         number;
    nb_grades:           number;
    class:               number;
    figure:              number;
    carac1:              number;
    carac2:              number;
    carac3:              number;
    rarity:              string;
    salaries:            string;
    id_world:            number;
    id_quest_get:        number;
    name:                string;
    release_date:        string;
    upgrade_quests:      { [key: string]: number };
    hair_color1:         string;
    hair_color2:         string;
    eye_color1:          string;
    eye_color2:          string;
    zodiac:              string;
    element:             string;
    animated_grades:     number[];
    anniversary:         string;
    grade_offset_values: Array<number[]>;
    element_data:        ThemeElement;
    is_released:         boolean;
    blessed_caracs:      BlessedCaracsClass;
    grade_offsets:       GradeOffsets;
}

export interface ThemeElement {
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
    id_member: number;
    id_girl:   number;
    id_skill:  number;
    level:     number;
    tier:      number;
    skill:     SkillSkill;
}

export interface SkillSkill {
    level:              number;
    class:              number;
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
    element:                ThemeElement;
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
