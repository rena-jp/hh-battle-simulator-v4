export interface EditTeamGlobal {
    teamGirls:               TeamGirlElement[];
    hero_data:               HeroData;
    availableGirls:          AvailableGirl[];
    theme_resonance_bonuses: ThemeResonanceBonuses;
    shared:                  Shared;
}

export interface AvailableGirl {
    id_girl:             number;
    id_girl_ref:         number;
    nb_grades:           number;
    class:               number;
    figure:              number;
    carac1:              number;
    carac2:              number;
    carac3:              number;
    rarity:              string;
    id_world:            number;
    id_quest_get:        number;
    element:             string;
    id_role:             number | null;
    name:                string;
    release_date:        string;
    anniversary:         string;
    eye_color1:          string;
    eye_color2:          string;
    hair_color1:         string;
    hair_color2:         string;
    upgrade_quests:      { [key: string]: number };
    scene_paths:         { [key: string]: null | string };
    animated_grades:     AnimatedGrade[];
    grade_offset_values: Array<number[] | GradeOffsetValueClass>;
    images:              Images;
    zodiac:              string;
    blessing_bonuses:    any[] | { [key: string]: BlessingBonus };
    default_avatar:      string;
    grade_skins:         number[];
    level:               number;
    graded:              number;
    awakening_level:     number;
    xp:                  number;
    id_member:           number;
    shards:              number;
    fav_graded:          number;
    ts_pay:              number;
    affection:           number;
    id_places_of_power:  number | null;
    date_added:          string;
    ico:                 string;
    avatar:              string;
    black_avatar:        string;
    grade_offsets:       GradeOffsets;
    Graded:              string;
    graded2:             string;
    style:               string;
    element_data:        ElementData;
    skill_tiers_info:    { [key: string]: SkillTiersInfo };
    salary:              number;
    salary_timer:        number;
    pay_time:            number;
    pay_in:              number;
    salary_per_hour:     number;
    position_img:        string;
    can_be_blessed:      boolean;
    can_be_blessed_pvp4: boolean;
    blessed_attributes:  string[];
    armor:               AvailableGirlArmor[];
    caracs:              BlessedCaracsClass;
    caracs_sum:          number;
    orgasm:              number;
}

export interface AnimatedGrade {
    grade:    number;
    format:   string;
    path:     string;
    filename: string;
    asset:    string;
}

export interface AvailableGirlArmor {
    id_girl_armor_equipped: number;
    id_member:              number;
    id_girl_item_armor:     number;
    id_item_skin:           number;
    id_variation:           number;
    level:                  number;
    id_girl:                number;
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
    id_girl_item_armor: number;
    rarity:             string;
    carac1:             number;
    carac2:             number;
    carac3:             number;
    damage:             number;
    defense:            number;
    ego:                number;
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
    class:   Class;
    element: Class;
    figure:  Class;
}

export interface Class {
    identifier: string;
    resonance:  string;
    bonus:      number;
}

export interface Skin {
    release_date: string;
    id_item_skin: number;
    id_skin_set:  number;
    identifier:   string;
    subtype:      number;
    wearer:       string;
    weight:       number;
    name:         string;
    ico:          string;
}

export interface Variation {
    id_variation:      number;
    rarity:            string;
    class:             number;
    class_resonance:   string;
    element:           string;
    element_resonance: string;
    figure:            number;
    figure_resonance:  string;
}

export interface BlessingBonus {
    carac1: number[];
    carac2: number[];
    carac3: number[];
}

export interface BlessedCaracsClass {
    carac1: number;
    carac2: number;
    carac3: number;
}

export interface ElementData {
    type:                                     string;
    weakness:                                 string;
    domination:                               string;
    domination_ego_bonus_percent:             number;
    domination_damage_bonus_percent:          number;
    domination_critical_chance_bonus_percent: number;
    ico_url:                                  string;
    flavor:                                   string;
}

export interface GradeOffsetValueClass {
    "1": number;
}

export interface GradeOffsets {
    static:   number[];
    animated: number[];
}

export interface Images {
    ava: string[];
    ico: string[];
}

export interface SkillTiersInfo {
    tier:              number;
    icon:              string;
    skill_points_used: number;
    icon_path:         string;
}

export interface HeroData {
    damage:        number;
    defense:       number;
    chance:        number;
    remaining_ego: number;
    class:         number;
    ico:           string;
    level:         number;
    nickname:      string;
    team:          Team;
}

export interface Team {
    caracs:                   TeamCaracs;
    remaining_ego:            number;
    hitter_girl_id:           number;
    id_team:                  number;
    id_member:                number;
    slot_index:               number;
    theme:                    string;
    girls_ids:                number[];
    total_power:              number;
    girls:                    TeamGirlElement[];
    synergies:                Synergy[];
    theme_elements:           ElementData[];
    power_display:            number;
    max_team_size:            number;
    min_team_size:            number;
    locked:                   boolean;
    selected_for_battle_type: string[];
}

export interface TeamCaracs {
    ego:     number;
    damage:  number;
    defense: number;
    chance:  number;
}

export interface TeamGirlElement {
    id_member:               number;
    id_girl:                 number;
    shards:                  number;
    level:                   number;
    fav_graded:              number;
    graded:                  number;
    ts_pay:                  number;
    affection:               number;
    xp:                      number;
    id_places_of_power:      null;
    date_added:              string;
    awakening_level:         number;
    girl:                    TeamGirlGirl;
    armor:                   TeamGirlArmor[];
    salary:                  number;
    pay_time:                number;
    pay_in:                  number;
    caracs:                  BlessedCaracsClass;
    blessed_caracs:          BlessedCaracsClass;
    blessed_caracs_pvp4:     BlessedCaracsClass;
    caracs_sum:              number;
    blessed_attributes:      string[];
    can_be_blessed:          boolean;
    can_be_blessed_pvp4:     boolean;
    graded2:                 string;
    favorite_grade:          number;
    salary_per_hour:         number;
    ico:                     string;
    ava:                     string;
    level_cap:               number;
    awakening_costs:         number;
    is_owned:                boolean;
    affection_details:       AffectionDetails;
    xp_details:              XPDetails;
    skill_tiers_info:        { [key: string]: SkillTiersInfo };
    skills:                  { [key: string]: SkillValue };
    skill_trait:             string;
    skill_tiers_unlocked:    number[];
    battle_caracs:           BattleCaracs;
    power_display:           number;
    lively_scenes:           any[];
    member_grade_skins:      MemberGradeSkin[];
    grade_skins_stats_bonus: number;
    selected_grade_skin_num: null;
}

export interface AffectionDetails {
    cur:         number;
    level:       number;
    min:         number;
    max:         number;
    left:        number;
    ratio:       number;
    maxed:       boolean;
    can_upgrade: boolean;
}

export interface TeamGirlArmor {
    id_girl_armor_equipped: number;
    id_member:              number;
    id_girl_item_armor:     number;
    id_item_skin:           number;
    id_variation:           number;
    level:                  number;
    id_girl:                number;
    caracs:                 ArmorCaracs;
    slot_index:             number;
    armor:                  ArmorArmor;
    skin:                   Skin;
    variation:              Variation;
    rarity:                 string;
    type:                   string;
    resonance_bonuses:      ResonanceBonusesClass;
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

export interface TeamGirlGirl {
    id_girl:             number;
    id_girl_ref:         number;
    nb_grades:           number;
    class:               number;
    figure:              number;
    carac1:              number;
    carac2:              number;
    carac3:              number;
    rarity:              string;
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
    animated_grades:     AnimatedGrade[];
    anniversary:         string;
    grade_offset_values: Array<number[]>;
    preview_scenes:      Array<string[]>;
    blessing_bonuses:    { [key: string]: BlessingBonus };
    id_role:             number;
    role_data:           RoleData;
    element_data:        ElementData;
    is_released:         boolean;
    blessed_caracs:      BlessedCaracsClass;
    grade_offsets:       GradeOffsets;
    preview:             Preview;
    default_avatar:      string;
    grade_skins:         number[];
    grade_skins_data:    GradeSkinsDatum[];
}

export interface GradeSkinsDatum {
    id_girl_grade_skin: number;
    id_girl:            number;
    num_order:          number;
    girl_grade_num:     number;
    type:               string;
    animation_format:   string;
    offset_values:      GradeOffsets;
    grade_skin_name:    string;
    image_path:         string;
    ico_path:           string;
    animation_infos:    AnimationInfos;
    release_date:       string;
    is_released:        boolean;
    is_owned:           boolean;
    shards_count:       number;
    is_selected:        number;
}

export interface AnimationInfos {
    path:     string;
    filename: string;
    asset:    string;
}

export interface Preview {
    poses:         string[];
    scenes:        string[];
    lively_scenes: any[];
    position_img:  string;
}

export interface RoleData {
    id:          number;
    name:        string;
    flavour:     string;
    description: string;
}

export interface MemberGradeSkin {
    id_member_girl_grade_skin: number;
    id_member:                 number;
    id_girl:                   number;
    id_girl_grade_skin:        number;
    shards_count:              number;
    is_selected:               number;
    date_added:                string;
    is_owned:                  boolean;
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

export interface XPDetails {
    cur:   number;
    min:   number;
    max:   number;
    level: number;
    left:  number;
    ratio: number;
    maxed: boolean;
}

export interface Synergy {
    element:                ElementData;
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
    reward:             Reward;
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
    club:          Club;
    currencies:    { [key: string]: number };
    mc_level:      string;
}

export interface Club {
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

export interface Reward {
    newReward: NewReward;
}

export interface NewReward {
    slotTemplate: AdBanner;
}

export interface RewardPopup {
    Reward: RewardClass;
}

export interface RewardClass {
    onCloseCallback:     null;
    content_button_data: null;
}

export interface ThemeResonanceBonuses {
    nature: Nature;
    light:  Light;
}

export interface Light {
    defense: number;
}

export interface Nature {
    defense: number;
    chance:  number;
}
