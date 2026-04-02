export interface Dictionary {
    nav: {
        start: string;
        about: string;
        creator: string;
        ai: string;
        blog: string;
        articles: string;
        contact: string;
    };
    hero: {
        greeting: string;
        role: string;
        contactBtn: string;
        moreBtn: string;
    };
    expertise: {
        title: string;
        subtitle: string;
        items: {
            title: string;
            description: string;
        }[];
    };
    ai: {
        title: string;
        subtitle: string;
        badge: string;
        headingMain: string;
        headingSub: string;
        description: string;
        list: string[];
        stats: {
            efficiency: string;
            assistants: string;
            fit: string;
        };
    };
    contentCreator: {
        title: string;
        subtitle: string;
        skiing: string;
        description: string;
    };
    contact: {
        title: string;
        subtitle: string;
        rights: string;
    };
    blog: {
        title: string;
        subtitle: string;
        readMore: string;
        back: string;
        empty: string;
    };
    articles: {
        title: string;
        subtitle: string;
        readMore: string;
        back: string;
        empty: string;
    };
}
