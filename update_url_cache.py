import os

# Directory to scan for files to cache
directory_to_cache = './'

# Function to create a list of all files to cache
def generate_cache_urls(directory):
    urls = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            # Include .html, .css, .js, .png, .jpg, .svg, .woff, .woff2, .ttf, .eot, .py, .json
            if file.endswith(('.html', '.css', '.js', '.png', '.jpg', '.svg', '.woff', '.woff2', '.ttf', '.eot', '.py', '.json')):
                file_path = os.path.join(root, file)
                # Convert to a URL path
                url_path = file_path.replace('\\', '/').replace(directory_to_cache, '/')
                urls.append(f"    '{url_path}',")
    return urls

# Generate the URLs to cache
urls_to_cache = generate_cache_urls(directory_to_cache)

# Template for the service-worker.js content
service_worker_template = """const CACHE_NAME = 'gmt-cache-v1';
const urlsToCache = [
    '/',
{urls}
];

// Install the service worker
self.addEventListener('install', event => {{
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {{
                return cache.addAll(urlsToCache);
            }})
    );
}});

// Activate the service worker
self.addEventListener('activate', event => {{
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {{
            return Promise.all(
                cacheNames.map(cacheName => {{
                    if (!cacheWhitelist.includes(cacheName)) {{
                        return caches.delete(cacheName);
                    }}
                }})
            );
        }})
    );
}});

// Fetch files from the cache or network
self.addEventListener('fetch', event => {{
    event.respondWith(
        caches.match(event.request)
            .then(response => {{
                return response || fetch(event.request);
            }})
    );
}});
"""

# Fill in the template with the generated URLs
service_worker_content = service_worker_template.format(urls="\n".join(urls_to_cache))

# Write the content to the service-worker.js file
with open('service-worker.js', 'w') as file:
    file.write(service_worker_content)

print("service-worker.js has been generated with the updated URLs to cache.")
