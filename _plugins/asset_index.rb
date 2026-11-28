# Generates an "open directory" style index page for /assets/ and subfolders.
require "open3"
require "time"

module AssetIndex
  ROOT = "assets".freeze

  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      files = site.static_files.select { |f| f.relative_path.start_with?("/#{ROOT}/") }
      git_dates = git_modified_dates(site.source)
      dirs = { ROOT => { files: [], dirs: [] } }

      files.each do |f|
        parts = f.relative_path.sub(%r{\A/}, "").split("/")
        # register every ancestor directory
        (1...parts.length).each do |i|
          dir = parts[0...i].join("/")
          dirs[dir] ||= { files: [], dirs: [] }
          next if i == 1
          parent = parts[0...i - 1].join("/")
          dirs[parent][:dirs] |= [dir]
        end
        dirs[parts[0...-1].join("/")][:files] << f
      end

      dirs.each do |dir, entry|
        page = Jekyll::PageWithoutAFile.new(site, site.source, dir, "index.html")
        page.data["layout"] = "assets"
        # virtual page has no source file; override last-modified-at plugin value
        page.data["last_modified_at"] = site.time
        page.data["title"] = "/#{dir}/"
        page.data["css"] = "assets"
        page.data["crumbs"] = crumbs(dir)
        page.data["parent"] = dir == ROOT ? nil : "/#{File.dirname(dir)}/".sub("/./", "/")
        page.data["folders"] = entry[:dirs].sort.map do |d|
          { "name" => File.basename(d), "url" => "/#{d}/",
            "count" => files.count { |f| f.relative_path.start_with?("/#{d}/") } }
        end
        page.data["entries"] = entry[:files].sort_by(&:name).map do |f|
          { "name" => f.name, "url" => f.relative_path.gsub(" ", "%20"),
            "ext" => f.extname.delete(".").downcase,
            "size" => f.respond_to?(:path) && File.exist?(f.path) ? File.size(f.path) : 0,
            "modified" => git_dates[f.relative_path.sub(%r{\A/}, "")] || "-" }
        end
        page.content = ""
        site.pages << page
      end
    end

    private

    def git_modified_dates(source)
      output, status = Open3.capture2e(
        "git", "-C", source, "log", "--format=%cI", "--name-only", "--", ROOT
      )
      unless status.success?
        raise Jekyll::Errors::FatalException,
          "Could not read Git history for #{ROOT}: #{output.strip}"
      end

      dates = {}
      current_date = nil
      output.each_line do |line|
        line = line.chomp
        if line.match?(/\A\d{4}-\d{2}-\d{2}T/)
          current_date = Time.iso8601(line).strftime("%Y-%m-%d %H:%M")
        elsif line.start_with?("#{ROOT}/")
          dates[line] ||= current_date
        end
      end
      dates
    end

    def crumbs(dir)
      parts = dir.split("/")
      parts.each_index.map do |i|
        { "name" => parts[i], "url" => "/#{parts[0..i].join('/')}/" }
      end
    end
  end
end

# {{ bytes | human_size }}
module AssetFilters
  def human_size(bytes)
    b = bytes.to_f
    return "#{b.to_i} B" if b < 1024
    units = %w[KB MB GB]
    units.each do |u|
      b /= 1024
      return format("%.1f %s", b, u) if b < 1024 || u == "GB"
    end
  end
end
Liquid::Template.register_filter(AssetFilters)
