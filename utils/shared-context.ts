export class SharedContext {
    private data: { [key: string]: any } = {};

    set(key: string, value: any): Promise<void> {
        return new Promise((resolve) => {
            this.data[key] = value;
            resolve(); 
        });
    }

    get(key: string): Promise<any> {
        return new Promise((resolve) => {
            const value = this.data[key];
            resolve(value); 
        });
    }
}