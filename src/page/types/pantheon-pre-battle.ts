export interface PantheonPreBattleGlobal {
    hero_data:        HeroData;
    opponent_fighter: OpponentFighter;
}

export interface HeroData {
    id_fighter:          string;
    nickname:            string;
    class:               string;
    level:               string;
    team:                HeroDataTeam;
    current_season_mojo: number;
    remaining_ego:       number;
    damage:              number;
    defense:             number;
    chance:              number;
    ico:                 string;
    club:                Club;
    stun:                null;
    shield:              null;
    burn:                null;
}

export interface Club {
    id_club: string;
    name:    string;
}

export interface HeroDataTeam {
    id_team:                  string;
    id_member:                number;
    slot_index:               string;
    theme:                    string;
    girls_ids:                string[];
    total_power:              number;
    caracs:                   PurpleCaracs;
    girls:                    PurpleGirl[];
    synergies:                Synergy[];
    theme_elements:           any[];
    remaining_ego:            number;
    power_display:            number;
    hitter_girl_id:           number;
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
    skills:               any[] | { [key: string]: SkillsSkill };
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

export interface SkillsSkill {
    id_member: string;
    id_girl:   string;
    id_skill:  string;
    level:     string;
    tier:      number;
    skill:     PurpleSkill;
}

export interface PurpleSkill {
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

export interface OpponentFighter {
    player:  Player;
    rewards: Rewards;
}

export interface Player {
    id_fighter:          string;
    nickname:            string;
    class:               string;
    level:               string;
    team:                PlayerTeam;
    current_season_mojo: number;
    remaining_ego:       number;
    damage:              number;
    defense:             number;
    chance:              number;
    ico:                 string;
    club:                null;
    stun:                null;
    shield:              null;
    burn:                null;
}

export interface PlayerTeam {
    id_team:                  null;
    id_member:                null;
    slot_index:               null;
    theme:                    string;
    girls_ids:                string[];
    total_power:              number;
    caracs:                   FluffyCaracs;
    girls:                    FluffyGirl[];
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

export interface FluffyCaracs {
    ego:     number;
    damage:  number;
    defense: number;
    chance:  number;
}

export interface FluffyGirl {
    id_member:            null;
    id_girl:              string;
    shards:               null;
    level:                string;
    fav_graded:           null;
    graded:               string;
    ts_pay:               null;
    affection:            null;
    xp:                   null;
    id_places_of_power:   null;
    date_added:           null;
    awakening_level:      number;
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
    skills:               { [key: string]: GirlSkill };
    skill_trait:          string;
    skill_tiers_unlocked: number[];
    skill_tiers_info:     { [key: string]: SkillTiersInfo };
}

export interface GirlSkill {
    id_member: null;
    id_girl:   number;
    id_skill:  number;
    level:     number;
    tier:      number;
    skill:     FluffySkill;
}

export interface FluffySkill {
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

export interface Rewards {
    loot:    boolean;
    rewards: Reward[];
    shards:  Shard[];
}

export interface Reward {
    type:      string;
    orbs_type: string;
    value:     number;
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
    caracs:          ShardCaracs;
    graded2:         string;
    level:           number;
    element_data:    Element;
    salary_per_hour: number;
}

export interface ShardCaracs {
    carac1: number;
    carac2: number;
    carac3: number;
}
