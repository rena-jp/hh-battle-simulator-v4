export interface LeaguesGlobal {
    opponents_list: OpponentsList[];
    shared:         Shared;
}

export interface OpponentsList {
    player:                    Player;
    rewards:                   Rewards;
    match_history:             { [key: string]: Array<MatchHistoryClass | null> | boolean };
    country:                   string;
    country_text:              string;
    girls_count_per_element:   GirlsCountPerElement;
    boosters:                  Booster[];
    place:                     number;
    player_league_points:      number;
    change:                    string;
    player_league_avg_points?: number;
}

export interface Booster {
    id_member_booster_equipped: number;
    id_member:                  number;
    id_item:                    number;
    lifetime:                   number;
    usages_remaining:           number;
    item:                       Item;
    expiration:                 number;
    price_sell:                 number;
}

export interface Item {
    id_item:              number;
    type:                 string;
    identifier:           string;
    rarity:               string;
    price:                number;
    currency:             string;
    value:                number;
    carac1:               number;
    carac2:               number;
    carac3:               number;
    endurance:            number;
    chance:               string;
    ego:                  number;
    damage:               number;
    duration:             number;
    skin:                 string;
    name:                 string;
    ico:                  string;
    display_price:        number;
    default_market_price: number;
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
    match_points: number;
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
    club:                  PlayerClub | null;
    stun:                  null;
    shield:                null;
    burn:                  null;
    team:                  Team;
}

export interface PlayerClub {
    name:    string;
    id_club: number;
}

export interface Team {
    caracs:         TeamCaracs;
    remaining_ego:  null;
    hitter_girl_id: number;
    id_team:        null;
    id_member:      null;
    slot_index:     null;
    theme:          string;
    girls_ids:      number[];
    total_power:    number;
    synergies:      Synergy[];
    theme_elements: ThemeElement[];
    power_display:  number;
    max_team_size:  number;
    min_team_size:  number;
    girls:          GirlElement[];
}

export interface TeamCaracs {
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
    element_data: ThemeElement;
    rarity:       string;
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
    rewards: RewardElement[];
}

export interface RewardElement {
    type:         string;
    value:        number | string;
    gem_type?:    string;
    gem_tooltip?: string;
}

export interface Shared {
    GirlSalaryManager:  GirlSalaryManager;
    HHMenu:             HHMenu;
    Hero:               Hero;
    POPUP_TYPES:        PopupTypes;
    PopupQueueManager:  PopupQueueManager;
    Tutorial:           Tutorial;
    TutorialPopup:      TutorialPopup;
    adBanner:           AdBanner;
    animations:         Animations;
    custom_bundle:      AdBanner;
    data_list:          AdBanner;
    energy:             AdBanner;
    general:            General;
    girl_animation:     AdBanner;
    hh_crosspromo:      HhCrosspromo;
    home:               AdBanner;
    home_monthly_card:  AdBanner;
    leaderboard:        AdBanner;
    messenger_emoji:    AdBanner;
    payments:           AdBanner;
    popup_payment:      PopupPayment;
    popups_manager:     PopupsManager;
    progress_bar:       AdBanner;
    reward:             SharedReward;
    reward_popup:       RewardPopup;
    shards_bar:         AdBanner;
    shop_builder:       AdBanner;
    tab_system:         AdBanner;
    team_block_builder: AdBanner;
    timer:              AdBanner;
    tooltip:            AdBanner;
    webp_utilities:     AdBanner;
}

export interface GirlSalaryManager {
    girlsMap:                 AdBanner;
    girlsListSec:             any[];
    startedHomepageTimerInfo: AdBanner;
    updateSecInterval:        number;
    hoverIntervals:           AdBanner;
    isSecRunning:             boolean;
    is_home:                  boolean;
    DEBUG:                    boolean;
}

export interface AdBanner {
}

export interface HHMenu {
    isMenuOpen:          boolean;
    menuTimeout:         number;
    $nav:                null;
    $menu:               null;
    $pachinkoAnimations: null;
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
    id_club:                   number;
    name:                      string;
    status:                    string;
    level_restriction:         number;
    ico:                       string;
    max_members:               number;
    created_by:                number;
    created_at:                string;
    place:                     number;
    upgrades_data:             UpgradesData;
    total_contribution_points: number;
    total_upgrades:            number;
    member_count:              number;
    level:                     string;
    leader_id:                 string;
    leader_name:               string;
    co_leaders:                string[];
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
    drill:     Challenge;
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
    xp:                              number;
    id:                              number;
    carac1:                          number;
    carac2:                          number;
    carac3:                          number;
    is_tester:                       number;
    is_cheater:                      number;
    level:                           number;
    class:                           number;
    name:                            string;
    questing:                        Questing;
    harem_endurance:                 number;
    caracs:                          InfosCaracs;
    Xp:                              XP;
    screen_ratio:                    number;
    nosound:                         boolean;
    no_pachinko_anim:                boolean;
    no_static_image_animation:       boolean;
    hc_confirm:                      boolean;
    hh_universe:                     string;
    hh_skin:                         string;
    on_prod_server:                  boolean;
    market_stats_purchase_steps:     number[];
    club_cooldown_ts:                number;
    censored_content:                boolean;
    pwa_rewards_claimed:             string[];
    server_time:                     string;
    footer_image_path:               string;
    wister_mobile_footer_image_path: string;
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
    id_world:          number;
    num_world:         number;
    step:              number;
    id_quest:          number;
    num_step:          number;
    current_url:       string;
    choices_adventure: number;
}

export interface PopupTypes {
    popup:        string;
    notification: string;
    toast:        string;
}

export interface PopupQueueManager {
    _queue_map: QueueMap;
}

export interface QueueMap {
    common:       Common;
    notification: Common;
    toast:        Common;
}

export interface Common {
    root_selector: string;
    queue:         any[];
}

export interface Tutorial {
    tutorialsList: any[];
    data:          AdBanner;
    initialized:   boolean;
    variant_infos: VariantInfos;
}

export interface VariantInfos {
    variant_identifier: string;
    tuto_version:       string;
    experiment:         string;
}

export interface TutorialPopup {
    _tuto_id:                    null;
    _tuto_text:                  null;
    _tutorialMessageCoordinates: null;
    _hiderCoordinates:           null;
    _multipleTutorialPopups:     any[];
    _onCloseCallback:            null;
    _onTutorialCallback:         null;
}

export interface Animations {
    appear_anim:      AdBanner;
    loadingAnimation: LoadingAnimation;
}

export interface LoadingAnimation {
    isLoading: boolean;
}

export interface General {
    Collect:             Collect;
    HHCanvasHeight:      number;
    HHCanvasWidth:       number;
    monthly_card_levels: { [key: string]: string };
    objectivePopup:      ObjectivePopup;
}

export interface Collect {
    cost: null;
}

export interface ObjectivePopup {
    pointsBox: AdBanner;
}

export interface HhCrosspromo {
    adData:                  AdBanner;
    localCrosspromoRewards:  AdBanner;
    remoteCrosspromoRewards: AdBanner;
    finishedCrosspromo:      AdBanner;
}

export interface PopupPayment {
    offers_new_viewed:     any[];
    offers_viewed_timeout: AdBanner;
}

export interface PopupsManager {
    HHPopupManager:        HhPopupManager;
    HHSlidingPopupManager: HhPopupManager;
}

export interface HhPopupManager {
    listQueuedPopups:    any[];
    listOpenedPopups:    AdBanner;
    listQueuedCallbacks: AdBanner;
    isHandlerAdded:      boolean;
}

export interface SharedReward {
    newReward: NewReward;
}

export interface NewReward {
    slotTemplate: AdBanner;
}

export interface RewardPopup {
    Reward: Reward;
}

export interface Reward {
    onCloseCallback:     null;
    content_button_data: null;
}
