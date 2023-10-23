export interface TowerOfFameGlobal {
    opponents_list: OpponentsList[];
    Hero:           Hero;
}

export interface Hero {
    infos:         Infos;
    energies:      Energies;
    energy_fields: { [key: string]: EnergyField };
    no_glitter:    boolean;
    caracs:        string[];
    club:          HeroClub;
    currencies:    { [key: string]: number };
    mc_level:      string;
}

export interface HeroClub {
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

export interface OpponentsList {
    player:                  Player;
    rewards:                 Rewards;
    match_history:           { [key: string]: Array<MatchHistoryClass | null> | boolean };
    country:                 string;
    country_text:            string;
    girls_count_per_element: GirlsCountPerElement;
    boosters:                Booster[];
    place:                   number;
    player_league_points:    string;
}

export interface Booster {
    id_member_booster_equipped: string;
    id_member:                  string;
    id_item:                    string;
    lifetime:                   string;
    usages_remaining:           string;
    item:                       Item;
    expiration:                 number;
    price_sell:                 number;
}

export interface Item {
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

export interface GirlsCountPerElement {
    sun:      number;
    psychic:  number;
    water:    number;
    nature:   number;
    stone:    number;
    darkness: number;
    fire:     number;
    light:    number;
}

export interface MatchHistoryClass {
    attacker_won: string;
    match_points: string;
}

export interface Player {
    id_fighter:          string;
    nickname:            number | string;
    class:               number;
    level:               string;
    team:                Team;
    current_season_mojo: number;
    remaining_ego:       number;
    damage:              number;
    defense:             number;
    chance:              number;
    ico:                 string;
    club:                PlayerClub | null;
    stun:                null;
    shield:              null;
    burn:                null;
}

export interface PlayerClub {
    name:    number | string;
    id_club: number;
}

export interface Team {
    id_team:        null;
    id_member:      null;
    slot_index:     null;
    theme:          string;
    girls_ids:      number[];
    total_power:    number;
    caracs:         TeamCaracs;
    girls:          GirlElement[];
    synergies:      Synergy[];
    theme_elements: ThemeElement[];
    remaining_ego:  null;
    power_display:  number;
    hitter_girl_id: number;
    max_team_size:  number;
    min_team_size:  number;
}

export interface TeamCaracs {
    ego:     number;
    damage:  number;
    defense: number;
    chance:  number;
}

export interface GirlElement {
    id_member:            number;
    id_girl:              number;
    shards:               null;
    level:                number;
    fav_graded:           number | string;
    graded:               number;
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
    id_member: number;
    id_girl:   number;
    id_skill:  number;
    level:     number;
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

export interface Rewards {
    loot:    boolean;
    rewards: Reward[];
}

export interface Reward {
    type:         string;
    value:        number | string;
    gem_type?:    string;
    gem_tooltip?: string;
}
