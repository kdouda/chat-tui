// This is necessary because this blessed library writes into styles, making them shared...

class StyleProvider {

    get buttonStyle() {
        return {
            bg: 'white', 
            fg: 'black',
            focus: {
                bg: 'yellow'
            }
        };
    }

    get inputStyle() {
        return {
            bg: 'white',
            fg: 'black',
            focus: {
                bg: 'yellow'
            }
        }
    }
}

const style = new StyleProvider();

export default style;