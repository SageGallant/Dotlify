# Dotlify - Email Alias Generator

Dotlify is a modern, responsive web application that generates thousands of email aliases from a single base email address. Perfect for managing your online presence, preventing spam, and improving email organization.

## Features

- **Multiple Alias Generation Methods:**

  - **Dot Method:** Inserts dots in different positions of your username (e.g., `u.s.e.r.n.a.m.e@gmail.com`)
  - **Plus Method:** Adds tags after a plus sign (e.g., `username+shopping@gmail.com`) with hundreds of predefined tags
  - **Domain Method:** Uses alternative domains for popular email providers (e.g., `username@googlemail.com` instead of `username@gmail.com`) with extensive domain alternatives for many email providers
  - **Combined Method:** Applies all three methods simultaneously to create powerful, unique aliases

- **Flexible Filtering:** Choose which methods to include in your results

- **Randomized Display:** View aliases in random order to discover diverse options quickly, with ability to reshuffle at any time

- **Multiple Export Options:**

  - PDF
  - Plain text (.txt)
  - CSV (.csv)
  - Excel (.xlsx)

- **User-Friendly Interface:**
  - Fully responsive design optimized for mobile, tablet, and desktop
  - Dark mode toggle with persistent preference
  - Modern, vibrant color palette with excellent contrast
  - Click any alias to copy it to clipboard
  - Intuitive touch-friendly controls for mobile devices

## Design System

Dotlify uses a consistent design system with:

- **Primary Color:** Indigo - Used for primary actions and highlighting important elements
- **Secondary Color:** Cyan - Used for secondary actions and supporting elements
- **Accent Color:** Amber - Used for special highlights and attention-grabbing elements
- **Dark Mode Support:** Full theme toggle with automatic detection of system preferences
- **CSS Variables:** Theme colors centralized for easy customization

## Technical Implementation

Dotlify is built using vanilla JavaScript, HTML, and CSS with Tailwind CSS for styling. The application uses:

- **Mobile-first responsive design** using modern CSS techniques
- **Modern ES6+ JavaScript** for all functionality
- **CSS Variables** for theming and dark mode support
- **Tailwind CSS** for responsive styling fundamentals
- **CSS Grid and Flexbox** for advanced responsive layouts
- **Web APIs** for asynchronous operations and clipboard integration
- **LocalStorage** for persistent user preferences
- **External libraries:** jsPDF, SheetJS (xlsx), and FileSaver.js for export functionality

## Responsive Design Approach

Dotlify follows a mobile-first approach to ensure optimal experience across all devices:

1. **Fluid Typography:** Font sizes adjust based on viewport size
2. **Breakpoint System:** Layout transformations at appropriate screen widths (640px, 768px, 1024px, 1280px)
3. **Stacked-to-Horizontal Layouts:** Components stack vertically on mobile and transition to horizontal arrangements on larger screens
4. **Touch-Optimized Controls:** Larger touch targets (min. 44px) for buttons and interactive elements on small screens
5. **Adaptive Grid System:** Single column on mobile, expanding to multi-column on larger screens
6. **Responsive Form Elements:** Full-width inputs on mobile, side-by-side layouts on desktop
7. **Safe Area Support:** Proper inset handling for notched phones and modern devices

## Performance Considerations

Generating and displaying 10,000+ email aliases is resource-intensive. Dotlify implements several optimization techniques:

1. **Asynchronous Processing:** Alias generation happens asynchronously to prevent UI freezing
2. **Batch Rendering:** Aliases are rendered in batches to maintain smooth scrolling
3. **DOM Fragment Usage:** Document fragments minimize DOM reflows when adding many elements
4. **Lazy Loading:** Only visible aliases are rendered initially
5. **Throttling:** UI updates are throttled to prevent performance issues
6. **Optimized Mobile Experience:** Reduced animations and simplified layouts on mobile devices
7. **CSS Variables:** Efficient style management with central variable definitions

## Browser Compatibility

Dotlify works in all modern browsers (Chrome, Firefox, Safari, Edge) on both desktop and mobile devices. Some export features may have limited functionality in older browsers.

## Usage

1. Enter your base email address (e.g., `username@gmail.com`)
2. Click "Generate" to create thousands of aliases
3. Use the filter checkboxes to show/hide different alias types
4. Click on any alias to copy it to your clipboard
5. Use the export buttons to save aliases in your preferred format

## Privacy

Dotlify runs entirely in your browser. No email addresses or generated aliases are sent to any server or stored anywhere except in your browser's memory while the application is running.

## Accessibility

Dotlify prioritizes accessibility with:

- Semantic HTML structure
- Adequate color contrast
- Keyboard navigation support
- Touch-friendly controls with appropriately sized tap targets
- Screen reader compatibility

## License

MIT License

## Credits

- Built with [Tailwind CSS](https://tailwindcss.com/)
- Export functionality using [jsPDF](https://github.com/parallax/jsPDF), [SheetJS](https://sheetjs.com/), and [FileSaver.js](https://github.com/eligrey/FileSaver.js/)
- Responsive design inspired by best practices from [Interaction Design Foundation](https://www.interaction-design.org/literature/article/responsive-design-let-the-device-do-the-work)
