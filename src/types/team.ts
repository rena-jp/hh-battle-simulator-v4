interface Team {
    id_team: number | string | null; // nullable at teams page or opponent team
    theme: string; // nullable at teams page
    caracs: { damage: number; defense: number; ego: number; chance: number };
    girls: Girl[];
    synergies: Synergy[];
    theme_elements: ThemeElement[];
    selected_for_battle_type?: string[];
    // synergies: Synergy[];
    // theme: string;
    // theme_elements: ThemeElement[];
    // girls: Girl[];
    // id_member: number;
    // slot_index: number | string;
    // girls_ids: string[];
    // total_power: number;
    // caracs: TeamsDatumCaracs;
    // remaining_ego: number;
    // power_display: number;
    // hitter_girl_id: number;
    // max_team_size: number;
    // min_team_size: number;
    // locked: boolean;
}
