import { content } from '../i18n/content';

export type ThemeCategory = keyof typeof content.id.themes.categories;

export interface Theme {
	/** Permanent code shown in WhatsApp messages. Never renumber. */
	code: string;
	name: string;
	category: ThemeCategory;
	/** Couple and date on the dummy cover. */
	cover: { first: string; second: string; date: string };
	/** Cover colours (theme surfaces, not Satamu brand tokens). */
	palette: { screen: string; text: string; photo: string };
}

// Dummy themes until the real WordPress themes and screenshots are ready.
export const themes: Theme[] = [
	{
		code: 'T01',
		name: 'Arunika',
		category: 'elegant',
		cover: { first: 'Nayla', second: 'Fikri', date: '6 Maret 2027' },
		palette: {
			screen: 'linear-gradient(180deg,#f7f1e8,#efe3cf)',
			text: '#4a3b2a',
			photo: 'radial-gradient(circle at 40% 30%,#e8d5b5,#b08d57)',
		},
	},
	{
		code: 'T02',
		name: 'Kembang Setaman',
		category: 'floral',
		cover: { first: 'Citra', second: 'Galih', date: '17 April 2027' },
		palette: {
			screen: 'linear-gradient(180deg,#fdf0f3,#f6d9e1)',
			text: '#6b2f43',
			photo: 'radial-gradient(circle at 40% 30%,#f9c9d6,#d6798f)',
		},
	},
	{
		code: 'T03',
		name: 'Semesta',
		category: 'modern',
		cover: { first: 'Maharani', second: 'Yoga', date: '9 Januari 2027' },
		palette: { screen: '#14213d', text: '#f5f1e6', photo: 'radial-gradient(circle at 40% 30%,#3b5b8c,#1d3557)' },
	},
	{
		code: 'T04',
		name: 'Hening',
		category: 'minimal',
		cover: { first: 'Dewi', second: 'Arif', date: '22 Mei 2027' },
		palette: { screen: '#fafafa', text: '#262626', photo: 'radial-gradient(circle at 40% 30%,#e5e5e5,#a3a3a3)' },
	},
	{
		code: 'T05',
		name: 'Sabana',
		category: 'rustic',
		cover: { first: 'Rara', second: 'Bima', date: '12 Juni 2027' },
		palette: {
			screen: 'linear-gradient(180deg,#f3ead8,#e2cfa9)',
			text: '#5b4325',
			photo: 'radial-gradient(circle at 40% 30%,#d9b98a,#8c6a3f)',
		},
	},
	{
		code: 'T06',
		name: 'Kirana',
		category: 'elegant',
		cover: { first: 'Salsa', second: 'Rendy', date: '3 Juli 2027' },
		palette: { screen: '#1f2a24', text: '#e9dcc0', photo: 'radial-gradient(circle at 40% 30%,#c9a96e,#6b5a3a)' },
	},
	{
		code: 'T07',
		name: 'Melati',
		category: 'floral',
		cover: { first: 'Putri', second: 'Adit', date: '28 Agustus 2027' },
		palette: {
			screen: 'linear-gradient(180deg,#f4f7f1,#dfe9d6)',
			text: '#33472f',
			photo: 'radial-gradient(circle at 40% 30%,#cfe0c3,#7d9b6f)',
		},
	},
	{
		code: 'T08',
		name: 'Langit Senja',
		category: 'modern',
		cover: { first: 'Anisa', second: 'Reza', date: '11 September 2027' },
		palette: { screen: 'linear-gradient(180deg,#ffb38a,#ff6542)', text: '#ffffff', photo: 'rgb(255 255 255 / 22%)' },
	},
	{
		code: 'T09',
		name: 'Sederhana',
		category: 'minimal',
		cover: { first: 'Tari', second: 'Dani', date: '2 Oktober 2027' },
		palette: { screen: '#f1efe9', text: '#3a3a35', photo: 'radial-gradient(circle at 40% 30%,#dcd8cc,#9a958a)' },
	},
	{
		code: 'T10',
		name: 'Rimba',
		category: 'rustic',
		cover: { first: 'Lala', second: 'Iqbal', date: '16 Oktober 2027' },
		palette: { screen: '#2f3b2c', text: '#efe6d2', photo: 'radial-gradient(circle at 40% 30%,#8ba070,#4a5a3c)' },
	},
	{
		code: 'T11',
		name: 'Puspa',
		category: 'floral',
		cover: { first: 'Indah', second: 'Fajar', date: '6 November 2027' },
		palette: {
			screen: 'linear-gradient(180deg,#f3f0fb,#ddd5f2)',
			text: '#3f3466',
			photo: 'radial-gradient(circle at 40% 30%,#cbbef0,#7d6bb8)',
		},
	},
	{
		code: 'T12',
		name: 'Gemintang',
		category: 'elegant',
		cover: { first: 'Vina', second: 'Hafiz', date: '20 November 2027' },
		palette: {
			screen: 'linear-gradient(180deg,#1b1b2f,#2e2e4d)',
			text: '#f0e6c8',
			photo: 'radial-gradient(circle at 40% 30%,#e7d19a,#9a7b3a)',
		},
	},
	{
		code: 'T13',
		name: 'Kota Kita',
		category: 'modern',
		cover: { first: 'Mega', second: 'Rian', date: '4 Desember 2027' },
		palette: { screen: '#e8eef2', text: '#102a43', photo: 'radial-gradient(circle at 40% 30%,#b7c9d6,#526779)' },
	},
	{
		code: 'T14',
		name: 'Putih Gading',
		category: 'minimal',
		cover: { first: 'Lina', second: 'Agus', date: '18 Desember 2027' },
		palette: { screen: '#fffdf8', text: '#4b4436', photo: 'radial-gradient(circle at 40% 30%,#efe7d6,#c4b593)' },
	},
	{
		code: 'T15',
		name: 'Ladang',
		category: 'rustic',
		cover: { first: 'Tiara', second: 'Yusuf', date: '8 Januari 2028' },
		palette: {
			screen: 'linear-gradient(180deg,#f6e7d7,#e9c9a6)',
			text: '#6a3f1f',
			photo: 'radial-gradient(circle at 40% 30%,#e3b48a,#a5673a)',
		},
	},
	{
		code: 'T16',
		name: 'Anggrek',
		category: 'floral',
		cover: { first: 'Ayu', second: 'Dimas', date: '22 Januari 2028' },
		palette: {
			screen: 'linear-gradient(180deg,#fff4ef,#ffd9c9)',
			text: '#7a3420',
			photo: 'radial-gradient(circle at 40% 30%,#ffc3a8,#e2775a)',
		},
	},
	{
		code: 'T17',
		name: 'Nawasena',
		category: 'elegant',
		cover: { first: 'Sinta', second: 'Wahyu', date: '5 Februari 2028' },
		palette: {
			screen: 'linear-gradient(180deg,#f2ede4,#ddd0b8)',
			text: '#2e2a24',
			photo: 'radial-gradient(circle at 40% 30%,#cdbb97,#7a6a4c)',
		},
	},
	{
		code: 'T18',
		name: 'Garis Tegas',
		category: 'modern',
		cover: { first: 'Kania', second: 'Bayu', date: '19 Februari 2028' },
		palette: { screen: '#111111', text: '#ffffff', photo: 'radial-gradient(circle at 40% 30%,#555555,#222222)' },
	},
];

/** Categories in filter order, limited to those that have at least one theme. */
export const themeCategories = (Object.keys(content.id.themes.categories) as ThemeCategory[]).filter((key) =>
	themes.some((theme) => theme.category === key),
);

/** Round-robin across categories so the unfiltered list opens with a varied mix. */
export const interleavedThemes = () => {
	const groups = themeCategories.map((key) => themes.filter((theme) => theme.category === key));
	return Array.from({ length: Math.max(0, ...groups.map((group) => group.length)) }, (_, round) => groups.map((group) => group[round]))
		.flat()
		.filter((theme) => theme !== undefined);
};

/** Themes shown on the home page (two rows of six on desktop). */
export const HOME_THEME_LIMIT = 12;
