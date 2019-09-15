export class BookEntity {
    public Title: string;
    public Author: string;
    public Length: number | null;
    public PublishedDate: Date | null;

    public Reset(): void {
        this.Title = "";
        this.Author = "";
        this.Length = null;
        this.PublishedDate = null;
    }
}