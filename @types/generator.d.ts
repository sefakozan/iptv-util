export class Playlist {
    /**
     * @type {Link[]}
     */
    offline: Link[];
    /**
     * @type {Link[]}
     */
    links: Link[];
    header: {
        "x-tvg-url": string;
        "url-tvg": string;
    };
    /**
     * @param {Link} link
     */
    addLink(link: Link): void;
    check(max?: number): Promise<Playlist>;
    toText(): string;
    toJson(): {
        header: {
            "x-tvg-url": string;
            "url-tvg": string;
        };
        links: Link[];
    };
    #private;
}
export class Link {
    /**
     * @param {string} url
     */
    constructor(url: string);
    url: string;
    title: string;
    duration: number;
    /** @typedef {{ "tvg-id"?: string, "tvg-name"?: string, "tvg-logo"?: string }} ExtInf */
    extinf: {};
    extgrp: string;
    extvlcopt: {
        "http-referrer": string;
        "http-user-agent": string;
    };
}
