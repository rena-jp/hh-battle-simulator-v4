export interface HomeGlobal {
    Hero: Hero;
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
    caracs:                      Caracs;
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

export interface Caracs {
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
