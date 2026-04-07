export interface FullLevel {
    id: number;
    name: string;
    author_name?: string;
    author_gd_id?: number;
    version?: string,
    data?: string,
    downloads?: number,
    officialSong?: number,
    customSongID?: number,
    likes?: number,
    length?: number,
    description?: string,
    stars?: number,
    demon?: boolean,
    demonDifficulty?: number,

}
export interface Creator {
    userId: number;
    username: string;
    accountId: number;
}
