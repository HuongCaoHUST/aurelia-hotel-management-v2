FROM node:22-slim AS builder
WORKDIR /app
COPY frontend-staff/package*.json ./frontend-staff/
COPY packages/shared ./packages/shared
RUN npm install --prefix frontend-staff
COPY frontend-staff ./frontend-staff
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ARG VITE_BASE_PATH=/staff/
ENV VITE_BASE_PATH=${VITE_BASE_PATH}
RUN npm run build --prefix frontend-staff

FROM nginx:1.27-alpine
COPY --from=builder /app/frontend-staff/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
