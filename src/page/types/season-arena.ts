export interface SeasonArenaGlobal {
    hero_data:           HeroData;
    caracs_per_opponent: { [key: string]: CaracsPerOpponent };
    opponents:           Opponent[];
}

export interface CaracsPerOpponent {
    remaining_ego: number;
    damage:        number;
    defense:       number;
    chance:        number;
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
    ico:                   string;
    current_season_mojo:   number;
    club:                  Club;
    stun:                  null;
    shield:                null;
    burn:                  null;
    team:                  HeroDataTeam;
}

export interface Club {
    id_club: number;
    name:    string;
}

export interface HeroDataTeam {
    caracs:                   PurpleCaracs;
    remaining_ego:            number;
    hitter_girl_id:           number;
    id_team:                  number;
    id_member:                number;
    slot_index:               number;
    theme:                    string;
    girls_ids:                number[];
    total_power:              number;
    synergies:                Synergy[];
    theme_elements:           any[];
    power_display:            number;
    max_team_size:            number;
    min_team_size:            number;
    locked:                   boolean;
    selected_for_battle_type: string[];
    girls:                    GirlElement[];
}

export interface PurpleCaracs {
    ego:     number;
    damage:  number;
    defense: number;
    chance:  number;
}

export interface GirlElement {
    id_member:               number;
    id_girl:                 number;
    level:                   number;
    graded:                  number;
    fav_graded:              number;
    caracs:                  BlessedCaracsClass;
    blessed_caracs:          BlessedCaracsClass;
    caracs_sum:              number;
    selected_grade_skin_num: null;
    ava:                     string;
    graded2:                 string;
    ico:                     string;
    skill_tiers_info:        { [key: string]: SkillTiersInfo };
    girl:                    GirlGirl;
}

export interface BlessedCaracsClass {
    carac1: number;
    carac2: number;
    carac3: number;
}

export interface GirlGirl {
    name:         string;
    element_data: Element;
    rarity:       string;
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

export interface Opponent {
    player:  Player;
    rewards: Rewards;
}

export interface Player {
    id_fighter:            number;
    remaining_ego:         number;
    damage:                number;
    defense:               number;
    chance:                number;
    percent_remaining_ego: number;
    nickname:              string;
    level:                 number;
    class:                 number;
    ico:                   string;
    current_season_mojo:   number;
    club:                  Club;
    stun:                  null;
    shield:                null;
    burn:                  null;
    team:                  PlayerTeam;
}

export interface PlayerTeam {
    caracs:         FluffyCaracs;
    remaining_ego:  null;
    hitter_girl_id: number;
    id_team:        null;
    id_member:      null;
    slot_index:     null;
    theme:          string;
    girls_ids:      number[];
    total_power:    number;
    synergies:      Synergy[];
    theme_elements: any[];
    power_display:  number;
    max_team_size:  number;
    min_team_size:  number;
    girls:          GirlElement[];
}

export interface FluffyCaracs {
    ego:     number;
    damage:  number;
    defense: number;
    chance:  number;
}

export interface Rewards {
    loot:    boolean;
    rewards: Reward[];
    team:    TeamElement[];
}

export interface Reward {
    type:         string;
    value:        number | string;
    gem_type?:    string;
    gem_tooltip?: string;
}

export interface TeamElement {
    type:  string;
    value: number;
}
