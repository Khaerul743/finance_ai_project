# Gunakan image Node.js
FROM node:18-alpine

# Buat direktori kerja di dalam container
WORKDIR /app

# Copy file project ke dalam container
COPY package*.json ./
RUN npm install

# Copy semua file source code
COPY . .

# Jalankan aplikasi
CMD ["npm", "start"]

# Expose port aplikasi
EXPOSE 3000