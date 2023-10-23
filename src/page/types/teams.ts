export interface TeamsGlobal {
    teams_data: { [key: string]: TeamsDatum };
}

export interface TeamsDatum {
    id_team:                  null | string;
    id_member:                number;
    slot_index:               number | string;
    theme:                    null | string;
    girls_ids:                string[];
    total_power:              number;
    caracs:                   TeamsDatumCaracs;
    girls:                    GirlElement[];
    synergies:                Synergy[];
    theme_elements:           ThemeElement[];
    remaining_ego:            number;
    power_display:            number;
    hitter_girl_id:           number;
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
    girl:                 GirlGirl;
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

export interface BlessedCaracsClass {
    carac1: number;
    carac2: number;
    carac3: number;
}

export interface GirlGirl {
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
    element_data:        ThemeElement;
    is_released:         boolean;
    blessed_caracs:      BlessedCaracs;
    grade_offsets:       number[];
}

export interface BlessedCaracs {
    carac1: number | string;
    carac2: number | string;
    carac3: number | string;
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
